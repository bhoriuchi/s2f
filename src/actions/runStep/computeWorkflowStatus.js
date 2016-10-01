import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult } from '../common'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
let { values: { BASIC, TASK, WORKFLOW } } = StepTypeEnum
let { values: { FAIL, SUCCESS, JOINED } } = RunStatusEnum

export default function computeWorkflowStatus (payload, done) {

  let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId } = payload
  let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step

  this.log.trace({ workflowRun }, 'attempting to complete workflow run computation')

  return this.lib.S2FWorkflow(`{
    readWorkflowRun (id: "${workflowRun}") {
      threads {
        stepRuns {
          step { type, failsWorkflow }
          status
        }
      }
    }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      let threads = _.get(data, 'readWorkflowRun[0].threads')
      if (!threads) throw new Error('No threads found')

      let stepRuns = _.reduce(threads, (left, right) => _.union(left, _.get(right, 'stepRuns', [])), [])

      let success = _.reduce(stepRuns, (left, stepRun) => {
        let failable = _.includes([ BASIC, TASK, WORKFLOW ], stepRun.type)
        let stepSuccess = !(stepRun.failsWorkflow && failable && stepRun.status !== FAIL)
        return left && stepSuccess
      }, true)

      return this.lib.S2FWorkflow(`mutation Mutation {
        updateWorkflowRunThread (id: "${thread}", status: ${JOINED})
        { id }
      }`)
        .then((result) => gqlResult(this, result, (err, data) => {
          if (err) throw err

          this.log.trace({ workflowRun }, 'joined final thread')

          return this.lib.S2FWorkflow(`mutation Mutation {
            endWorkflowRun (id: "${workflowRun}", status: ${ success ? SUCCESS : FAIL })
          }`)
            .then((result) => gqlResult(this, result, (err, data) => {
              if (err) throw err
              this.log.debug({ workflowRun, success }, 'workflow run completed')
              return done()
            }))
        }))
    }))
    .catch((error) => {
      this.log.error({ error }, 'failed to compute workflow')
      done(error)
    })
}