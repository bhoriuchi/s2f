import _ from 'lodash'
import sbx from 'sbx'
import { gqlResult } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import nextStepRun from './nextStepRun'
import handleContext from './handleContext'

let { values: { SUCCESS, RUNNING } } = RunStatusEnum

export default function runSource (payload, done) {

  let { thread, endStep, localCtx, step, stepRunId, workflowRun } = payload
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

      // non-async or last step
      if (!async || success === endStep) return run

      // since run has already been called, we just remove the resolve dependency from nextStep
      return nextStepRun.call(this, { thread, workflowRun, step: success }, done)
    }))
    .catch((error) => {
      done(error)
    })
}