import _ from 'lodash'
import chalk from 'chalk'
import sbx from 'sbx'
import { gqlResult } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import nextStepRun from './nextStepRun'
import handleContext from './handleContext'

let { values: { RUNNING } } = RunStatusEnum
let { values: { LOOP } } = StepTypeEnum

// basic source run
export function basicRun (runOpts) {
  let { source, context, timeout, payload, done } = runOpts
  return sbx.vm(source, _.merge({ context, timeout }, _.get(this.options, 'vm', {})))
    .then(handleContext.call(this, payload, done))
}

// loop source
export function loopRun (runOpts, loop = 0) {
  let { source, context, timeout, payload, done } = runOpts
  context.loop = loop
  return sbx.vm(source, _.merge({ context, timeout }, _.get(this.options, 'vm', {})))
    .then((ctx) => {
      if (ctx._result === false || ctx._exception) return handleContext.call(this, payload, done)(ctx)
      return loopRun.call(this, { source, context: ctx, timeout, payload, done }, loop++)
    })
}


export default function runSource (payload, done) {

  let { thread, endStep, localCtx, step, workflowRun } = payload
  let { async, source, timeout, success } = step
  if (!source) return done(new Error('No source'))

  return this.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread ( id: "${thread}", status: ${RUNNING} )
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      let runOpts = { source, context: localCtx, timeout, payload, done }
      let run = step.type === LOOP ? loopRun.call(this, runOpts) : basicRun.call(this, runOpts)

      // non-async or last step
      if (!async || success === endStep) return run

      // async - since run has already been called, we just remove the resolve dependency from nextStep
      return nextStepRun.call(this, { thread, workflowRun, nextStep: success, async }, done)
    }))
    .catch((error) => {
      done(error)
    })
}