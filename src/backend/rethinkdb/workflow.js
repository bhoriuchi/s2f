export function cloneWorkflow (backend, id) {

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
  return function (source, args, context, info) {
    let { filterTemporalWorkflow } = this.globals._temporal
    return filterTemporalWorkflow(args).run(connection)
  }
}

export function updateWorkflow (backend) {
  return function (source, args, context, info) {

  }
}

export function deleteWorkflow (backend) {
  return function (source, args, context, info) {

  }
}



export default {
  cloneWorkflow,
  createWorkflow,
  readWorkflow,
  updateWorkflow,
  deleteWorkflow
}