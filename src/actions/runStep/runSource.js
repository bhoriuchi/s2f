import _ from 'lodash'
import sbx from 'sbx'
import { updateWorkflowRunThread } from '../query'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
import nextStepRun from './nextStepRun'
import handleContext from './handleContext'

let { values: { RUNNING } } = RunStatusEnum
let { values: { LOOP } } = StepTypeEnum

// basic source run
export function basicRun (runOpts) {
  let { source, context, timeout, payload, done } = runOpts
  let options = _.merge({ context, timeout }, _.get(this.options, 'vm', {}))

  return sbx.vm(source, options, (err, ctx) => {
    if (err) return done(err)
    return handleContext.call(this, payload, done)(ctx)
  })
}

// loop source
export function loopRun (runOpts, loop = 0) {
  let { source, context, timeout, payload, done } = runOpts
  let options = _.merge({ context, timeout }, _.get(this.options, 'vm', {}))
  context.loop = loop

  return sbx.vm(source, options, (err, ctx) => {
    if (err) return done(err)
    if (ctx._result === false || ctx._exception) return handleContext.call(this, payload, done)(ctx)
    return loopRun.call(this, { source, context: ctx, timeout, payload, done }, loop++)
  })
}

export default function runSource (payload, done) {
  try {
    let { thread, endStep, localCtx, step, workflowRun } = payload
    let { async, source, timeout, success } = step
    if (!source) return done(new Error('No source'))

    return updateWorkflowRunThread(this, { id: thread, status: `Enum::${RUNNING}` }, (err) => {
      if (err) return done(err)

      let runOpts = { source, context: localCtx, timeout, payload, done }
      let run = step.type === LOOP ? loopRun.call(this, runOpts) : basicRun.call(this, runOpts)

      // non-async or last step
      if (!async || success === endStep) return run

      // async - since run has already been called, we just remove the resolve dependency from nextStep
      return nextStepRun.call(this, { thread, workflowRun, nextStep: success, async }, done)
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to run source step')
    done(error)
  }
}