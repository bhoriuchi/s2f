import _ from 'lodash'
import { newWorkflowRun } from '../query'
import runStep from '../runStep/index'

export default function startWorkflow (backend) {
  return function (runner, task, done) {
    try {
      let { context: { args, input, parent } } = task
      let taskId = task.id

      if (!args) return done(new Error('No arguments were supplied'))

      return newWorkflowRun(backend, { args, input, taskId, parent }, (err, run) => {
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