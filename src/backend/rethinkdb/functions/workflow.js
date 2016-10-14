import _ from 'lodash'
import { isPublished } from './common'
import { destroyStep } from './step'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'
import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
let { values: { TASK, WORKFLOW } } = StepTypeEnum
let { values: { INPUT } } = ParameterClassEnum

export function getFullWorkflow (backend, args) {
  let { r, connection } = backend
  let workflow = backend.getTypeCollection('Workflow')
  let parameter = backend.getTypeCollection('Parameter')
  let step = backend.getTypeCollection('Step')

  return workflow.get(args.id)
    .eq(null)
    .branch(
      r.error('Invalid workflow version'),
      workflow.get(args.id)
        .merge((w) => {
          return {
            parameters: parameter.filter({ parentId: args.id }).coerceTo('array'),
            steps: step.filter({ workflowId: w('id') })
              .coerceTo('array')
              .merge((s) => {
                return {
                  parameters: parameter.filter({ parentId: s('id') }).coerceTo('array')
                }
              })
          }
        })
    )
}

export function getNewUuids (type, r, wf) {
  let remap = type === 'fork' ? ['FORKID'] : []
  remap.push(wf.id)
  _.forEach(wf.parameters, (p) => remap.push(p.id))
  _.forEach(wf.steps, (s) => {
    remap.push(s.id)
    _.forEach(s.parameters, (p) => remap.push(p.id))
  })
  // map new uuids
  return r.expr(remap).map((id) => {
    return { orig: id, cur: r.uuid() }
  })
}

export function remapObjects (wf, idmap) {
  let newSteps = []
  let newParams = []

  // create the new workflow
  let newWorkflow = _.merge({}, _.omit(wf, ['steps', 'parameters']))
  if (idmap.FORKID) newWorkflow._temporal.recordId = idmap.FORKID
  newWorkflow._temporal.version = null
  newWorkflow._temporal.validFrom = null
  newWorkflow._temporal.validTo = null
  newWorkflow._temporal.changeLog = _.isArray(wf._temporal.changeLog) ? wf._temporal.changeLog : []
  newWorkflow.id = idmap[wf.id]

  // start creating the new parameters, steps, and workflows
  _.forEach(wf.parameters, (p) => {
    newParams.push(_.merge({}, p, { id: idmap[p.id], parentId: idmap[p.parentId] }))
  })

  _.forEach(wf.steps, (s) => {
    let st = _.merge({}, s)
    st._temporal.version = null
    st._temporal.validFrom = null
    st._temporal.validTo = null
    st.id = _.get(idmap, s.id, null)
    st.workflowId = _.get(idmap, s.workflowId, null)
    st.success = _.get(idmap, s.success, null)
    st.fork = _.get(idmap, s.fork, null)
    st.fail = _.get(idmap, s.fail, null)
    newSteps.push(st)

    _.forEach(s.parameters, (p) => {
      newParams.push(_.merge({}, p, { id: idmap[p.id], parentId: idmap[p.parentId] }))
    })
  })
  return { newWorkflow, newParams, newSteps }
}

export function cloneWorkflow (type, backend, args) {
  let { r, connection } = backend
  let workflow = backend.getTypeCollection('Workflow')
  let parameter = backend.getTypeCollection('Parameter')
  let step = backend.getTypeCollection('Step')

  let idmap = {}

  // first get the entire workflow version as 1 object
  return getFullWorkflow(backend, args).run(connection)
    .then((wf) => {
      return getNewUuids(type, r, wf).run(connection)
        .then((uuids) => {
          _.forEach(uuids, (m) => idmap[m.orig] = m.cur)

          let { newWorkflow, newSteps, newParams } = remapObjects(wf, idmap)
          newWorkflow._temporal.name = args.name || newWorkflow.id
          newWorkflow._temporal.changeLog.push(_.merge(args.changeLog || { user: 'SYSTEM', message: type }, {
            date: r.now(),
            type: type === 'branch' ? 'BRANCH' : 'FORK'
          }))

          return r.expr([ parameter.insert(newParams), step.insert(newSteps) ])
            .do(() => {
              return workflow.insert(newWorkflow, { returnChanges: true })('changes')
                .nth(0)('new_val')
            })
            .run(connection)
        })
    })
}

export function branchWorkflow (backend) {
  return function (source, args, context, info) {
    return cloneWorkflow('branch', backend, args)
  }
}

export function forkWorkflow (backend) {
  return function (source, args, context, info) {
    return cloneWorkflow('fork', backend, args)
  }
}

export function publishWorkflow (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let step = backend.getTypeCollection('Step')
    let tableName = backend.getTypeComputed('Workflow').collection

    let { extendPublish } = this.globals._temporal
    return extendPublish(tableName, args).then((wf) => {
      let { _temporal: { version, validFrom, validTo }, id } = wf
      return step.filter({ workflowId: id })
        .update({ _temporal: { version, validFrom, validTo } })
        .run(connection)
        .then(() => wf)
    })
  }
}

export function readWorkflowInputs (backend) {
  return function (source, args, context = {}, info) {
    let {r, connection} = backend
    let {filterTemporalWorkflow, filterTemporalTask} = this.globals._temporal
    let parameter = backend.getTypeCollection('Parameter')
    let step = backend.getTypeCollection('Step')
    context = _.omit(context, ['recordId', 'id'])

    return step.filter({workflowId: source.id})
      .map((s) => {
        return r.expr([WORKFLOW, TASK]).contains(s('type')).branch(
          // get the version args, default to context
          s.hasFields('versionArgs').branch(
            s('versionArgs').keys().count().ne(0).branch(
              s('versionArgs'),
              r.expr(context)
            ),
            r.expr(context)
          )
            .do((vargs) => {
              return r.branch(
                s('type').eq(WORKFLOW).and(s.hasFields('subWorkflow')),
                filterTemporalWorkflow(vargs.merge({recordId: s('subWorkflow')})),
                s('type').eq(TASK).and(s.hasFields('task')),
                filterTemporalTask(vargs.merge({recordId: s('task')})),
                r.error('Temporal relation missing reference')
              )
                .coerceTo('array')
                .do((recs) => {
                  return recs.count().eq(0).branch(
                    null,
                    recs.nth(0)('id')
                  )
                })
            }),
          s('id')
        )
          .do((id) => {
            return parameter.filter({parentId: id, class: INPUT})
              .filter((p) => p.hasFields('mapsTo').not().or(p('mapsTo').eq(null)))
              .coerceTo('array')
          })
      })
      .reduce((left, right) => left.union(right))
      .run(connection)
  }
}


export function createWorkflow (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend

    let { createTemporalWorkflow, createTemporalStep } = this.globals._temporal
    return r.do(r.uuid(), r.uuid(), r.uuid(), (wfId, startId, endId) => {
      args.id = wfId
      args.entityType = 'WORKFLOW'
      args.endStep = endId
      return createTemporalStep([
        {
          id: startId,
          entityType: 'STEP',
          name: 'Start',
          description: 'Starting point of the workflow',
          type: 'START',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId,
          fail: endId,
          workflowId: wfId
        },
        {
          id: endId,
          entityType: 'STEP',
          name: 'End',
          description: 'Ending point of the workflow',
          type: 'END',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId,
          fail: endId,
          workflowId: wfId
        }
      ]).do(() => createTemporalWorkflow(args)('changes').nth(0)('new_val'))
    })
      .run(connection)
  }
}

export function readWorkflow (backend) {
  return function (source, args, context = {}, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Workflow')

    let { filterTemporalWorkflow, mostCurrentTemporalWorkflow } = this.globals._temporal
    if (source && source.workflow) return table.get(source.workflow).run(connection)
    context.date = args.date || context.date
    if (_.keys(args).length) return filterTemporalWorkflow(args).run(connection)
    return mostCurrentTemporalWorkflow().run(connection)
  }
}

export function readWorkflowVersions (backend) {
  return function (source, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getTypeCollection('Workflow')
    let filter = table.filter({ _temporal: { recordId: args.recordId } })
    if (args.offset) filter = filter.skip(args.offset)
    if (args.limit) filter = filter.limit(args.limit)
    return filter.run(connection)
  }
}

export function updateWorkflow (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Workflow')

    return isPublished(backend, 'Workflow', args.id).branch(
      r.error('This workflow is published and cannot be modified'),
      table.get(args.id)
        .update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteWorkflow (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let workflow = backend.getTypeCollection('Workflow')
    let parameter = backend.getTypeCollection('Parameter')
    let step = backend.getTypeCollection('Step')

    return isPublished(backend, 'Workflow', args.id).branch(
      r.error('This workflow is published and cannot be deleted'),
      step.filter({ workflowId: args.id })
        .map((s) => s('id'))
        .coerceTo('array')
        .do((ids) => destroyStep(backend, ids))
        .do(() => parameter.filter({ parentId: args.id }).delete())
        .do(() => {
          return workflow.get(args.id)
            .delete()
            .do(() => true)
        })
    )
      .run(connection)
  }
}

export default {
  branchWorkflow,
  forkWorkflow,
  publishWorkflow,
  createWorkflow,
  readWorkflow,
  updateWorkflow,
  deleteWorkflow,
  readWorkflowInputs,
  readWorkflowVersions
}