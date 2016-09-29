import _ from 'lodash'
import sbx from 'sbx'
import { gqlResult } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import setStepStatus from './setStepStatus'
import handleContext from './handleContext'

let { values: { SUCCESS, RUNNING } } = RunStatusEnum

export default function runSource (payload, done) {

  let { thread, endStep, localCtx, step, stepRunId } = payload
  let { async, source, timeout, success } = step
  if (!source) return done(new Error('No source'))

  return this.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread ( id: "${thread}", status: ${RUNNING} )
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      let run = sbx.vm(source, _.merge({ context: localCtx, timeout }, this._vm))
        .then(handleContext.call(this, async, payload, done))

      if (!async || success === endStep) return run

      // TODO: change this to create the next step run
      return setStepStatus.call(this, stepRunId, SUCCESS).then(() => run)
    }))
    .catch((error) => {
      done(error)
    })
}