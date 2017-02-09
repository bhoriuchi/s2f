import _ from 'lodash'
import { mapInput } from '../common'
import { getWorkflowRun, startStepRun } from '../query'
import StepTypes from '../../graphql/types/StepTypeEnum'
import runSource from './runSource'
import forkSteps from './forkSteps'
import joinThreads from './joinThreads'
import runSubWorkflow from './runSubWorkflow'
import handleContext from './handleContext'

let { values: { BASIC, CONDITION, FORK, JOIN, LOOP, TASK, WORKFLOW } } = StepTypes

export default function runStep (backend) {
  return function (runner, task, done) {
    try {
      let { resume, context: { workflowRun, thread } } = task
      let taskId = task.id
      let resumeContext = _.get(task, 'data.context', {})

      if (!workflowRun || !thread) return done(new Error('No workflow run or main thread created'))

      return getWorkflowRun(backend, workflowRun, thread, (err, wfRun) => {
        if (err) return done(err)

        let { workflow, requestId, args, input, context, threads } = wfRun
        let step = _.get(threads, '[0].currentStepRun.step')
        let stepRunId = _.get(threads, '[0].currentStepRun.id')
        let endStep = _.get(workflow, 'endStep.id')

        if (!step) return done(new Error('No step found in thread'))
        if (!endStep) return done(new Error('No end step found'))

        backend.log.trace({ step: step.id, type: step.type }, 'successfully read step')

        let localCtx = mapInput(input, context, _.get(step, 'parameters', []))
        localCtx._resumeKey = stepRunId
        localCtx._taskId = taskId

        let payload = {
          runner,
          task,
          taskId,
          requestId,
          workflowRun,
          thread,
          endStep,
          localCtx,
          context,
          args,
          step,
          stepRunId
        }

        if (resume) return handleContext.call(backend, payload, done)(resumeContext)

        return startStepRun(backend, stepRunId, taskId, (err) => {
          if (err) return done(err)

          switch (step.type) {
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
      })
    } catch (error) {
      backend.log.error({
        errors: error.message || error,
        stack: error.stack
      }, 'Failed to start step')
      return done(error)
    }
  }
}