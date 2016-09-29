import _ from 'lodash'
import { gqlResult } from '../common'

export default function forkSteps (payload, done) {
  let { workflowRun, thread, step: { id } } = payload
  let event = _.get(this, 'server._emitter')
  if (!event) return done(new Error('No event emitter'))

  return this.lib.S2FWorkflow(`mutation Mutation {
    createForks (
      step: "${id}",
      workflowRun: "${workflowRun}",
      thread: "${thread}"
    )
    {
      id
    }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      _.forEach(_.get(data, 'createForks'), (fork) => {
        let thread = fork.id
        event.emit('schedule', {
          payload: {
            action: 'runStep',
            context: { thread, workflowRun }
          }
        })
      })
      done()
    }))
    .catch((error) => {
      this.log.error({
        errors: error.message || error,
        stack: error.stack
      }, 'Failed fork step')
      done(error)
    })
}