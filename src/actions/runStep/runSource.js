import _ from 'lodash'
import sbx from 'sbx'
import chalk from 'chalk'
import StepTypes from '../../graphql/types/StepTypeEnum'
import ParameterClass from '../../graphql/types/ParameterClassEnum'
import RunStatus from '../../graphql/types/RunStatusEnum'
import setStepStatus from './setStepStatus'
import endWorkflow from './endWorkflow'

let { values: { SUCCESS, FAIL, WAITING, JOINING } } = RunStatus
let { values: { ATTRIBUTE, INPUT, OUTPUT } } = ParameterClass
let { values: { BASIC, CONDITION, END, FORK, JOIN, LOOP, START, TASK, WORKFLOW } } = StepTypes
let HAS_SOURCE = [ BASIC, CONDITION, LOOP, TASK ]

export default function runSource (payload, done) {

  let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId } = payload
  let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step
  if (!source) return done(new Error('No source'))
  // let { workflowRun, thread } = parent
  let run = sbx.vm(source, _.merge({ context: localCtx, timeout }, this._vm))

  fail = fail || endStep

  // if async step, complete it first then resolve it
  if (async) return setStepStatus.call(this, stepRunId, SUCCESS).then(() => run)

  // regular steps should wait for the action to resolve
  return run.then((ctx) => {
    let failed = ctx._exception || ctx._result === false
    let nextStep = failed ? fail : success
    let status = failed ? FAILED : SUCCESS

    if (async) {
      if (nextStep === endStep) endWorkflow.call(this, workflowRun, done)
      return
    }

    return setStepStatus.call(this, stepRunId, status)
      .then(() => {
        if (nextStep === endStep) return endWorkflow.call(this, workflowRun, done)
        done()
      })
  })
    .catch((err) => {
      console.log(chalk.red(err))
      done(err)
    })
}