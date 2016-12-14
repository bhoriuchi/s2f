// TODO: refactor

import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult } from '../common'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
let { values: { BASIC, TASK, WORKFLOW } } = StepTypeEnum
let { values: { FAIL, SUCCESS, JOINED } } = RunStatusEnum

export default function computeWorkflowStatus (payload, done) {

  let { runner, workflowRun, thread, step } = payload
  let { failsWorkflow, success } = step

  this.log.trace({ workflowRun }, 'attempting to complete workflow run computation')

  return this.lib.S2FWorkflow(`{
    readWorkflowRun (id: "${workflowRun}") {
      context {
        parameter { name },
        value
      },
      threads {
        stepRuns {
          step { type, failsWorkflow }
          status
        }
      },
      parentStepRun,
      taskId
    }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err
      let localCtx = {}
      let { context, threads, parentStepRun, taskId } = _.get(data, 'readWorkflowRun[0]', {})
      if (!threads) throw new Error('No threads found')

      // get the local context
      _.forEach(context, (ctx) => {
        let name = _.get(ctx, 'parameter.name')
        if (name && _.has(ctx, 'value')) localCtx[name] = ctx.value
      })

      // reduce the step runs to determine the fail status
      let stepRuns = _.reduce(threads, (left, right) => _.union(left, _.get(right, 'stepRuns', [])), [])

      let success = _.reduce(stepRuns, (left, stepRun) => {
        let failable = _.includes([ BASIC, TASK, WORKFLOW ], stepRun.type)
        let stepSuccess = !(stepRun.failsWorkflow && failable && stepRun.status !== FAIL)
        return left && stepSuccess
      }, true)

      let status = success ? SUCCESS : FAIL

      return this.lib.S2FWorkflow(`mutation Mutation {
        updateWorkflowRunThread (id: "${thread}", status: ${JOINED})
        { id }
      }`)
        .then((result) => gqlResult(this, result, (err, data) => {
          if (err) throw err

          this.log.trace({ workflowRun }, 'joined final thread')

          return this.lib.S2FWorkflow(`mutation Mutation {
            endWorkflowRun (id: "${workflowRun}", status: ${status})
          }`)
            .then((result) => gqlResult(this, result, (err, data) => {
              if (err) throw err
              this.log.debug({ workflowRun, success }, 'workflow run completed')

              if (parentStepRun) runner.resume(taskId, { status, context: localCtx })
              return done(null, status, { context: localCtx })
            }))
        }))
    }))
    .catch((error) => {
      this.log.error({ error }, 'failed to compute workflow')
      done(error)
    })
}