import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult } from '../common'
import joinThreads from './joinThreads'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { RUNNING } } = RunStatusEnum
let { values: { JOIN } } = StepTypeEnum

export default function nextStepRun (payload, done) {
  let { thread, nextStep, async, workflowRun } = payload

  let event = _.get(this, 'server._emitter')
  if (!event && !async) return done(new Error('No event emitter'))

  return this.lib.S2FWorkflow(`{ readStep (id: "${nextStep}") { type } }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) {
        console.log(chalk.red(err))
        throw err
      }
      let type = _.get(data, 'readStep[0].type')

      if (!type) throw new Error('failed to get next step type')

      // if the type is join, call the join threads handler to avoid creating multiple
      // join steps when only one should be created on a new thread
      if (type === JOIN) return joinThreads.call(this, payload, done)

      // otherwise create the next step run
      return this.lib.S2FWorkflow(`mutation Mutation {
          createStepRun (step: "${nextStep}", workflowRunThread: "${thread}"),
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
    }))
}