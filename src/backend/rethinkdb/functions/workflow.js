import _ from 'lodash'
import chalk from 'chalk'
import { isPublished, getWorkflowInputs } from './common'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'
import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
let { values: { TASK, WORKFLOW, END } } = StepTypeEnum
let { values: { INPUT, ATTRIBUTE } } = ParameterClassEnum

export function getFullWorkflow (backend, args) {
  let { r, connection } = backend
  let workflow = backend.getCollection('Workflow')
  let parameter = backend.getCollection('Parameter')
  let step = backend.getCollection('Step')

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
  let workflow = backend.getCollection('Workflow')
  let parameter = backend.getCollection('Parameter')
  let step = backend.getCollection('Step')

  let idmap = {}

  // first get the entire workflow version as 1 object
  return getFullWorkflow(backend, args).run(connection)
    .then((wf) => {
      return getNewUuids(type, r, wf).run(connection)
        .then((uuids) => {
          _.forEach(uuids, (m) => idmap[m.orig] = m.cur)

          let { newWorkflow, newSteps, newParams } = remapObjects(wf, idmap, args)
          newWorkflow._temporal.name = args.name || newWorkflow.id
          newWorkflow._temporal.owner = args.owner || null
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
    let { connection } = backend
    let step = backend.getCollection('Step')

    let { extendPublish } = this.globals._temporal
    return extendPublish('Workflow', args).then((wf) => {
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
    let parameter = backend.getCollection('Parameter')
    let step = backend.getCollection('Step')
    return getWorkflowInputs(step, parameter, source.id).run(connection)
  }
}

export function readWorkflowVersions (backend) {
  return function (source, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getCollection('Workflow')
    let filter = table.filter({ _temporal: { recordId: args.recordId } })
    if (args.offset) filter = filter.skip(args.offset)
    if (args.limit) filter = filter.limit(args.limit)
    return filter.run(connection)
  }
}

export function readWorkflowParameters (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let parameter = backend.getCollection('Parameter')

    return parameter.filter({ parentId: source.id, class: ATTRIBUTE })
      .run(connection)
  }
}

export function readEndStep (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let step = backend.getCollection('Step')

    return step.filter({ workflowId: source.id, type: END })
      .coerceTo('array')
      .do((end) => {
        return end.count().eq(0).branch(
          null,
          end.nth(0)
        )
      })
      .run(connection)
  }
}

export default {
  branchWorkflow,
  forkWorkflow,
  publishWorkflow,
  readWorkflowInputs,
  readWorkflowVersions,
  readWorkflowParameters,
  readEndStep
}