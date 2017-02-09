import _ from 'lodash'
import { getRunSummary, updateWorkflowRunThread, endWorkflowRun } from '../query'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
let { values: { BASIC, TASK, WORKFLOW } } = StepTypeEnum
let { values: { FAIL, SUCCESS, JOINED } } = RunStatusEnum

export default function computeWorkflowStatus (payload, done) {
  try {
    let { runner, requestId, workflowRun, thread } = payload
    let localCtx = {}
    this.log.trace({ workflowRun }, 'attempting to complete workflow run computation')

    return getRunSummary(this, workflowRun, (err, wfRun) => {
      if (err) return done(err)

      let { context, threads, parentStepRun, taskId } = wfRun
      if (!threads) return done(new Error('no threads found'))

      // get the local context
      _.forEach(context, (ctx) => {
        let name = _.get(ctx, 'parameter.name')
        if (name && _.has(ctx, 'value')) localCtx[name] = ctx.value
      })

      // reduce the step runs to determine the fail status
      let stepRuns = _.reduce(threads, (left, right) => _.union(left, _.get(right, 'stepRuns', [])), [])

      // reduce success by type
      let success = _.reduce(stepRuns, (left, stepRun) => {
        let failable = _.includes([ BASIC, TASK, WORKFLOW ], stepRun.type)
        let stepSuccess = !(stepRun.failsWorkflow && failable && stepRun.status !== FAIL)
        return left && stepSuccess
      }, true)

      let status = success ? SUCCESS : FAIL

      return updateWorkflowRunThread(this, { id: thread, status: `Enum::${JOINED}` }, (err) => {
        if (err) return done(err)

        this.log.trace({ workflowRun }, 'joined final thread')
        return endWorkflowRun(this, workflowRun, status, (err) => {
          if (err) return done(err)
          this.log.debug({ workflowRun, success }, 'workflow run completed')
          if (parentStepRun) runner.resume(taskId, { parentStepRun, status, context: localCtx })
          return done(null, status, { context: localCtx })
        })
      })
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to compute workflow status')
    done(error)
  }
}