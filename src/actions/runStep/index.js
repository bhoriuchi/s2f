import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult, mapInput } from '../common'
import StepTypes from '../../graphql/types/StepTypeEnum'
import runSource from './runSource'
import forkSteps from './forkSteps'
import joinThreads from './joinThreads'
import runSubWorkflow from './runSubWorkflow'

let { values: { BASIC, CONDITION, END, FORK, JOIN, LOOP, START, TASK, WORKFLOW } } = StepTypes

export default function runStep (backend) {
  return function (runner, context = {}, done) {
    let { workflowRun, thread } = context
    if (!workflowRun || !thread) return done(new Error('No workflow run or main thread created'))

    return backend.lib.S2FWorkflow(`{
      readWorkflowRun (id: "${workflowRun}") {
        workflow { endStep { id } },
        args,
        input,
        context {
          id,
          parameter { id, name, type, scope, class },
          value
        },
        threads (id: "${thread}") {
          currentStepRun {
            id,
            step {
              id,
              type,
              async,
              source,
              subWorkflow { id },
              timeout,
              failsWorkflow,
              waitOnSuccess,
              requireResumeKey,
              success,
              fail,
              parameters { id, name, type, scope, class, mapsTo }
            }
          }
        }
      }
    }`)
      .then((result) => gqlResult(backend, result, (err, data) => {
        if (err) throw err
        let { workflow: { endStep }, args, input, context, threads } = _.get(data, 'readWorkflowRun[0]', {})
        let step = _.get(threads, '[0].currentStepRun.step')
        let stepRunId = _.get(threads, '[0].currentStepRun.id')
        endStep = _.get(endStep, 'id')
        if (!step) return done(new Error('No step found in thread'))
        if (!endStep) return done(new Error('No end step found'))
        backend.log.trace({ step: step.id, type: step.type }, 'Successfully queried step')

        // map all of the parameters
        let localCtx = mapInput(input, context, _.get(step, 'parameters', []))

        // everything is ready to run the task, set the task to running
        return backend.lib.S2FWorkflow(`mutation Mutation { startStepRun (id: "${stepRunId}") }`)
          .then((res) => {
            let payload = { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId }

            switch (step.type) {
              // case START:
              // case END:
              case BASIC:
                return runSource.call(backend, payload, done)
              case TASK:
                return runSource.call(backend, payload, done)
              case LOOP:
                return runSource.call(backend, payload, done)
              case CONDITION:
                return runSource.call(backend, payload, done)
              case JOIN:
                return joinThreads.call(backend, payload, done)
              case WORKFLOW:
                return runSubWorkflow.call(backend, payload, done)
              case FORK:
                return forkSteps.call(backend, payload, done)
              default:
                return done(new Error('Invalid step type or action cannot be performed on type'))
            }
          })
      }))
      .catch((error) => {
        backend.log.error({
          errors: error.message || error,
          stack: error.stack
        }, 'Failed to start step')
        return done(error)
      })
  }
}