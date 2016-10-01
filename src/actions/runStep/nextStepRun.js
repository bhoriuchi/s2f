import _ from 'lodash'
import { gqlResult } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { RUNNING } } = RunStatusEnum

export default function nextStepRun (payload, done) {
  let { thread, step, async, workflowRun } = payload

  let event = _.get(this, 'server._emitter')
  if (!event && !async) return done(new Error('No event emitter'))

  return this.lib.S2FWorkflow(`mutation Mutation {
    createStepRun (step: "${step}", workflowRunThread: "${thread}"),
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err
      let stepRunId = _.get(data, 'createStepRun.id')
      if (!stepRunId) throw new Error('Unable to create StepRun')

      return this.lib.S2FWorkflow(`mutation Mutation {
        updateWorkflowRunThread (id: "${thread}", currentStepRun: "${stepRunId}", status: ${RUNNING})
        { id }
      }`)
        .then((result) => gqlResult(this, result, (err, data) => {
          if (err) throw err

          event.emit('schedule', {
            payload: {
              action: 'runStep',
              context: { thread, workflowRun }
            }
          })
          return async ? true : done()
        }))
    }))

}