export function createWorkflowRun (backend) {
  let r = backend._r
  let workflowRun = backend._db.table(backend._tables.WorkflowRun.table)
  let parameterRun = backend._db.table(backend._tables.ParameterRun.table)
  let stepRun = backend._db.table(backend._tables.StepRun.table)
  let workflowRunThread = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return r.expr([ r.uuid(), r.uuid(), r.uuid() ])
      .do((workflowRunId, stepRunId, workflowRunThreadId) => {
        return workflowRun.insert({ id: workflowRunId, workflow: args.workflow, args: args.args, input: args.input })
          .do(() => {
            return workflowRunThread.insert({ id: workflowRunThreadId, workflowRun: workflowRunId, status: 'CREATED' })
          })
          .do(() => {
            return stepRun.insert({ id: stepRunId, workflowRunThread: workflowRunThreadId, step: args.step })
          })
      })
      .run(connection)
  }
}


export default {
  createWorkflowRun
}