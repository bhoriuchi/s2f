import _ from 'lodash'
import { getStep, newStepRun, updateWorkflowRunThread } from '../query'
import joinThreads from './joinThreads'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import chalk from 'chalk'
let { values: { RUNNING } } = RunStatusEnum
let { values: { JOIN } } = StepTypeEnum

export default function nextStepRun (payload, done) {
  try {
    let { thread, nextStep, async, workflowRun } = payload
    let event = _.get(this, 'server._emitter')
    if (!event && !async) return done(new Error('No event emitter'))

    return getStep(this, nextStep, (err, step) => {
      if (err) return done(err)
      let type = _.get(step, 'type')
      if (!type) return done(new Error('failed to get next step type'))

      // if the type is join, call the join threads handler to avoid creating multiple
      // join steps when only one should be created on a new thread
      if (type === JOIN) return joinThreads.call(this, payload, done)

      return newStepRun(this, nextStep, thread, (err, stepRun) => {
        if (err) return done(err)

        let stepRunId = _.get(stepRun, 'id')
        if (!stepRunId) throw new Error('Unable to create StepRun')
        let args = { id: thread, status: `Enum::${RUNNING}`, currentStepRun: stepRunId }
        return updateWorkflowRunThread(this, args, (err) => {
          if (err) return done(err)

          event.emit('schedule', {
            payload: {
              action: 'runStep',
              context: {
                thread,
                workflowRun
              }
            }
          })
          return async ? true : done()
        })
      })
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to start next step')
    return done(error)
  }
}