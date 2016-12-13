import _ from 'lodash'
import { gqlResult, mapInput } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import startWorkflow from '../startWorkflow/index'
import chalk from 'chalk'

let { values: { RUNNING } } = RunStatusEnum

export default function runSubWorkflow (payload, done) {
  console.log(chalk.blue('RUNNIN SUBWORKFLOW'))
  let { runner, thread, localCtx, args, step, stepRunId } = payload
  let { subWorkflow } = step

  return this.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread ( id: "${thread}", status: ${RUNNING} )
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      return startWorkflow.call(this, runner, {
        args: {
          recordId: _.get(subWorkflow, 'id'),
          date: args.date,
          version: args.version
        },
        input: localCtx,
        parent: stepRunId
      }, done)

    }))
    .catch((error) => {
      done(error)
    })
}