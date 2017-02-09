import _ from 'lodash'
import { newWorkflowRun } from '../query'
import runStep from '../runStep/index'
import resumeStep from '../runStep/resumeStep'

export default function startWorkflow (backend) {
  return function (runner, task, done) {
    try {
      let { requestId, resume, data, context: { args, input, parent } } = task
      let { parentStepRun, status, context } = data || {}
      let taskId = task.id

      // special case, if a subworkflow is the first step in a workflow
      // then the runstep should immediately be called to resume otherwise
      // an infinite loop will occur
      if (resume) return resumeStep(backend, parentStepRun, status, context, done)

      if (!args) return done(new Error('No arguments were supplied'))

      return newWorkflowRun(backend, { requestId, args, input, taskId, parent }, (err, run) => {
        if (err) return done(err)

        let workflowRun = _.get(run, 'id')
        let thread = _.get(run, 'threads[0].id')
        return runStep(backend)(runner, { id: taskId, context: { workflowRun, thread } }, done)
      })
    } catch (err) {
      backend.log.error({
        errors: err.message || err,
        stack: err.stack
      }, 'Failed to start workflow')
      return done(err)
    }
  }
}