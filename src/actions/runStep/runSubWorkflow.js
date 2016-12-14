import _ from 'lodash'
import { updateWorkflowRunThread } from '../query'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import startWorkflow from '../startWorkflow/index'

let { values: { RUNNING } } = RunStatusEnum

export default function runSubWorkflow (payload, done) {
  try {
    let { runner, taskId, thread, localCtx, args, step, stepRunId } = payload
    let { subWorkflow } = step

    return updateWorkflowRunThread(this, {id: thread, status: `Enum::${RUNNING}` }, (err) => {
      if (err) return done(err)

      return startWorkflow(this)(runner, {
        id: taskId,
        context: {
          args: {
            recordId: _.get(subWorkflow, '_temporal.recordId'),
            date: args.date,
            version: args.version
          },
          input: localCtx,
          parent: stepRunId
        }
      }, (err) => {
        if (err) return done(err)
      })
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to run sub workflow')
    return done(error)
  }
}