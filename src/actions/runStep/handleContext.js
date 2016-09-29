import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import setStepStatus from './setStepStatus'
import endWorkflow from './endWorkflow'

let { values: { SUCCESS, RUNNING, FAIL, WAITING, JOINING } } = RunStatusEnum

export default function handleContext (async, payload, done) {
  return (ctx) => {

    let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId } = payload
    let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step
    fail = fail || endStep

    let failed = ctx._exception || ctx._result === false
    let nextStep = failed ? fail : success
    let status = failed ? FAIL : SUCCESS

    return setStepStatus.call(this, stepRunId, status)
      .then(() => {
        if (nextStep === endStep) return endWorkflow.call(this, workflowRun, done)
        done()
      })
  }
}