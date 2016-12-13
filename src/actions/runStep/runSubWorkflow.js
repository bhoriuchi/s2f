import _ from 'lodash'
import { gqlResult, mapInput } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import startWorkflow from '../startWorkflow/index'
import chalk from 'chalk'

let { values: { RUNNING } } = RunStatusEnum

export default function runSubWorkflow (payload, done) {
  console.log(chalk.blue('RUNNIN SUBWORKFLOW'))
  let { runner, taskId, thread, localCtx, args, step, stepRunId } = payload
  let { subWorkflow } = step

  return this.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread ( id: "${thread}", status: ${RUNNING} )
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      console.log(chalk.magenta(JSON.stringify(data, null, '  ')))

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
      }, (err, status, data) => {
        if (err) return done(err)
      })

    }))
    .catch((error) => {
      done(error)
    })
}