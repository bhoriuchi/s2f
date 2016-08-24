export default function createWorkflow (r, connection) {
  return function (source, args, context, info) {
    let { createTemporalWorkflow, getResult } = this.globals._temporal
    return r.do(r.uuid(), r.uuid(), (startId, endId) => {
      args.steps = [
        {
          id: startId,
          name: 'Start',
          description: 'Starting point of the workflow',
          type: 'Start',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId
        },
        {
          id: endId,
          name: 'End',
          description: 'Ending point of the workflow',
          type: 'End',
          timeout: 0,
          failsWorkflow: false,
          waitOnSuccess: false,
          requireResumeKey: false,
          success: endId
        }
      ]
      return createTemporalWorkflow(args)
    })
      .run(connection)
      .then((result) => getResult(result))
  }
}