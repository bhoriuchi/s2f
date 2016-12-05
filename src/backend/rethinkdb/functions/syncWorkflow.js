import _ from 'lodash'
const UPDATE = 'update'
const INSERT = 'insert'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'
import EntityTypeEnum from '../../../graphql/types/EntityTypeEnum'
import ParameterScopeEnum from '../../../graphql/types/ParameterScopeEnum'

let { values: { END } } = StepTypeEnum
let { values: { PARAMETER, WORKFLOW, STEP } } = EntityTypeEnum

export function isNewId (id) {
  return id.match(/^new:/) !== null
}

export function mapIds (args, r) {
  let ids = {}

  // workflow id
  ids[args.id] = isNewId(args.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: args.id }

  // workflow parameters
  _.forEach(args.parameters, (param) => {
    ids[param.id] = isNewId(param.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: param.id }
  })

  // steps
  _.forEach(args.steps, (step) => {
    ids[step.id] = isNewId(step.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: step.id }
    _.forEach(step.parameters, (param) => {
      ids[param.id] = isNewId(param.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: param.id }
    })
  })

  return ids
}

export function getOp (ids, uuid, prefix) {
  let { op, id } = _.get(ids, uuid, {})
  return {
    [`${prefix}Id`]: id,
    [`${prefix}Op`]: op
  }
}

export default function syncWorkflow (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let parameter = backend.getTypeCollection('Parameter')
    let workflow = backend.getTypeCollection('Workflow')
    let step = backend.getTypeCollection('Step')
    let folder = backend.getTypeCollection('Folder')
    let membership = backend.getTypeCollection('FolderMembership')

    let makeTemporal = (obj) => {
      return _.merge(obj, {
        _temporal: {
          changeLog: [],
          recordId: r.uuid(),
          validFrom: null,
          validTo: null,
          version: null
        }
      })
    }

    return r.expr(mapIds(args, r))
      .run(connection)
      .then((ids) => {
        let isNewWorkflow = false
        let mutations = []
        let endStep = args.endStep
        let op = {
          [INSERT]: { workflow: {}, parameter: {}, step: {} },
          [UPDATE]: { workflow: {}, parameter: {}, step: {} }
        }

        // re-map workflow
        let { wfId, wfOp } = getOp(ids, args.id, 'wf')
        let wfObj = { id: wfId, entityType: WORKFLOW }
        if (wfOp === INSERT) {
          isNewWorkflow = true
          makeTemporal(wfObj)
        }
        _.set(op, `["${wfOp}"].workflow["${wfId}"]`, _.merge({}, _.omit(args, ['parameters', 'steps']), wfObj))
        let recordId = _.get(wfObj, '_temporal.recordId')


        // re-map attributes
        _.forEach(args.parameters, (param) => {
          let { paramId, paramOp } = getOp(ids, param.id, 'param')
          _.set(op, `["${paramOp}"].parameter["${paramId}"]`, _.merge({}, param, {
            id: paramId,
            parentId: wfId,
            scope: ParameterScopeEnum.ATTRIBUTE,
            entityType: PARAMETER
          }))
        })

        // re-map steps
        _.forEach(args.steps, (step) => {
          let { stepId, stepOp } = getOp(ids, step.id, 'step')
          if (step.type === END) endStep = stepId
          let stepObj = {
            id: stepId,
            success: _.get(ids, `["${step.success}"].id`, undefined),
            fail: _.get(ids, `["${step.fail}"].id`, undefined),
            task: _.get(step, 'task._temporal.recordId'),
            subWorkflow: _.get(step, 'subWorkflow._temporal.recordId'),
            entityType: STEP,
            workflowId: wfId
          }
          if (stepOp === INSERT) makeTemporal(stepObj)
          _.set(op, `["${stepOp}"].step["${stepId}"]`, _.merge({}, _.omit(step, ['threads', 'parameters']), stepObj))

          // re-map step params
          _.forEach(step.parameters, (param) => {
            let { paramId, paramOp } = getOp(ids, param.id, 'param')
            _.set(op, `["${paramOp}"].parameter["${paramId}"]`, _.merge({}, param, {
              id: paramId,
              parentId: stepId,
              scope: ParameterScopeEnum.STEP,
              entityType: PARAMETER
            }))
          })
        })

        // apply forks
        _.forEach(args.steps, (step) => {
          let { stepId } = getOp(ids, step.id, 'step')
          _.forEach(step.threads, (thread) => {
            let { threadId } = getOp(ids, thread.id, 'thread')
            if (threadId) {
              let s = _.get(op[INSERT].step, threadId) || _.get(op[UPDATE].step, threadId)
              if (s) s.fork = stepId
            }
          })
        })

        // create a flattened array of actions
        _.forEach(op, (colls, opName) => {
          _.forEach(colls, (coll, collName) => {
            _.forEach(coll, (obj, objId) => {
              mutations.push({
                id: objId,
                op: opName,
                collection: collName,
                data: obj
              })
            })
          })
        })

        // update endstep
        let wf = _.get(op[INSERT].workflow, wfId) || _.get(op[UPDATE].workflow, wfId)
        wf.endStep = endStep

        // process all mutations
        return r.expr(mutations).forEach((m) => {
          return m('op').eq(INSERT).branch(
            r.branch(
              m('collection').eq('workflow'),
              workflow.insert(m('data')),
              m('collection').eq('step'),
              step.insert(m('data')),
              parameter.insert(m('data'))
            ),
            r.branch(
              m('collection').eq('workflow'),
              workflow.get(m('id')).update(m('data')),
              m('collection').eq('step'),
              step.get(m('id')).update(m('data')),
              parameter.get(m('id')).update(m('data'))
            )
          )
        })
          .do(() => {
            return folder.get(args.folder || '').ne(null).branch(
              r.expr(isNewWorkflow).branch(
                membership.insert({ folder: args.folder, childId: recordId, childType: 'WORKFLOW' }),
                membership.get(recordId).update({ folder: args.folder })
              ),
              folder.filter({ type: 'WORKFLOW', parent: 'ROOT' })
                .nth(0)
                .do((rootFolder) => {
                  return r.expr(isNewWorkflow).branch(
                    membership.insert({ folder: rootFolder('id'), childId: recordId, childType: 'WORKFLOW' }),
                    membership.get(recordId).update({ folder: rootFolder('id') })
                  )
                })
            )
          })
          .do(() => workflow.get(wfId))
          .run(connection)
      })
  }
}