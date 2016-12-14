import _ from 'lodash'
import { newForks, setStepRunStatus } from '../query'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { FORKED } } = RunStatusEnum

export default function forkSteps (payload, done) {
  try {
    let { workflowRun, thread, stepRunId, step: { id } } = payload
    let event = _.get(this, 'server._emitter')
    if (!event) return done(new Error('no event emitter'))

    return newForks(this, id, workflowRun, thread, (err, forks) => {
      if (err) return done(err)

      return setStepRunStatus(this, stepRunId, FORKED, (err) => {
        if (err) return done(err)

        _.forEach(forks, (fork) => {
          event.emit('schedule', {
            payload: {
              action: 'runStep',
              context: {
                thread: fork.id,
                workflowRun
              }
            }
          })
        })
        return done()
      })
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to fork step')
    done(error)
  }
}