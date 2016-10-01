import chalk from 'chalk'

export default function computeWorkflowStatus (payload, done) {

  let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId } = payload
  let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step
  console.log(chalk.green('==== ENDING WORKFLOW', thread))
  done()
}