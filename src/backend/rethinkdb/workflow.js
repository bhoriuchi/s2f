import _ from 'lodash'
import { isPublished } from './common'
import { destroyStep } from './step'

export function getFullWorkflow (backend, args) {
  let r = backend._r
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let step = backend._db.table(backend._tables.Step.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
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
    st.id = idmap[s.id]
    st.workflowId = idmap[s.workflowId]
    st.success = s.success ? idmap[s.success] : null
    st.fail = s.fail ? idmap[s.fail] : null
    newSteps.push(st)

    _.forEach(s.parameters, (p) => {
      newParams.push(_.merge({}, p, { id: idmap[p.id], parentId: idmap[p.parentId] }))
    })
  })
  return { newWorkflow, newParams, newSteps }
}

export function cloneWorkflow (type, backend, args) {
  let r = backend._r
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let step = backend._db.table(backend._tables.Step.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection
  let idmap = {}

  // first get the entire workflow version as 1 object
  return getFullWorkflow(backend, args).run(connection)
    .then((wf) => {
      return getNewUuids(type, r, wf).run(connection)
        .then((uuids) => {
          _.forEach(uuids, (m) => idmap[m.orig] = m.cur)

          let { newWorkflow, newSteps, newParams } = remapObjects(wf, idmap)

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

export function createWorkflow (backend) {
  let r = backend._r
  let connection = backend._connection
  return function (source, args, context, info) {
    let { createTemporalWorkflow, createTemporalStep } = this.globals._temporal
    return r.do(r.uuid(), r.uuid(), r.uuid(), (wfId, startId, endId) => {
      args.id = wfId
      args.entityType = 'WORKFLOW'
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
  let connection = backend._connection
  return function (source, args, context = {}, info) {
    let { filterTemporalWorkflow } = this.globals._temporal
    context.date = args.date || context.date
    return filterTemporalWorkflow(args).run(connection)
  }
}

export function updateWorkflow (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Workflow.table)
  let connection = backend._connection
  return function (source, args, context, info) {
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
  let r = backend._r
  let step = backend._db.table(backend._tables.Step.table)
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection
  return function (source, args, context, info) {
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
  createWorkflow,
  readWorkflow,
  updateWorkflow,
  deleteWorkflow
}