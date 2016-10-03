import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult } from '../common'
import setStepStatus from './setStepStatus'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
let { values: { FORKED } } = RunStatusEnum

export default function forkSteps (payload, done) {
  let { workflowRun, thread, stepRunId, step: { id } } = payload
  let event = _.get(this, 'server._emitter')
  if (!event) return done(new Error('No event emitter'))

  return this.lib.S2FWorkflow(`mutation Mutation {
    createForks (step: "${id}", workflowRun: "${workflowRun}", workflowRunThread: "${thread}")
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      return setStepStatus.call(this, stepRunId, FORKED)
        .then(() => {
          _.forEach(_.get(data, 'createForks'), (fork) => {
            let thread = fork.id
            event.emit('schedule', {
              payload: {
                action: 'runStep',
                context: { thread, workflowRun }
              }
            })
          })
          return done()
        })
    }))
    .catch((error) => {
      this.log.error({
        errors: error.message || error,
        stack: error.stack
      }, 'Failed fork step')
      done(error)
    })
}