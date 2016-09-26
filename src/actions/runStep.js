import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult, convertType, emitOnce } from './common'
import StepTypes from '../graphql/types/StepTypeEnum'
import ParameterClass from '../graphql/types/ParameterClassEnum'
import RunStatus from '../graphql/types/RunStatusEnum'
import sbx from 'sbx'

let { values: { SUCCESS, FAIL, WAITING, JOINING } } = RunStatus
let { values: { ATTRIBUTE, INPUT, OUTPUT } } = ParameterClass
let { values: { BASIC, CONDITION, END, FORK, JOIN, LOOP, START, TASK, WORKFLOW } } = StepTypes
let HAS_SOURCE = [ BASIC, CONDITION, LOOP, TASK ]

export function endWorkflow (workflowRun, done) {
  console.log(chalk.green('==== NEXT STEP IS END'))
  done()
}


export function setStepStatus (stepRunId, status) {
  return this.lib.S2FWorkflow(`mutation Mutation { endStepRun (id: "${stepRunId}", status: "${status}") }`)
}

export function runSource (payload, done) {

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

export function mapInput (input, context, parameters) {
  let params = {}

  _.forEach(parameters, (param) => {
    if (param.class === OUTPUT) {
      params[param.name] = null
    } else if (param.class === INPUT) {
      if (param.mapsTo) {
        let { parameter, value } = _.find(context, (ctx) => _.get(ctx, 'parameter.id') === param.mapsTo) || {}
        if (parameter) params[param.name] = value
      } else {
        try {
          params[param.name] = convertType(param.type, param.name, _.get(input, param.name))
        } catch (err) {}
      }
    }
  })

  return params
}

export function runStep (backend) {
  return function (runner, context = {}, done) {
    let { workflowRun, thread } = context
    if (!workflowRun || !thread) return done(new Error('No workflow run or main thead created'))

    return backend.lib.S2FWorkflow(`{
      readWorkflowRun (id: "${workflowRun}") {
        workflow { endStep },
        args,
        input,
        context {
          parameter { id, name, type, scope, class },
          value
        },
        threads (id: "${thread}") {
          currentStepRun {
            id,
            step {
              id,
              type,
              async,
              source,
              subWorkflow,
              timeout,
              failsWorkflow,
              waitOnSuccess,
              requireResumeKey,
              success,
              fail,
              parameters { id, name, type, scope, class, mapsTo }
            }
          }
        }
      }
    }`)
      .then((result) => gqlResult(backend, result, (err, data) => {
        if (err) throw err

        console.log(JSON.stringify(data, null, '  '))

        let { workflow: { endStep }, args, input, context, threads } = _.get(data, 'readWorkflowRun[0]', {})
        let step = _.get(threads, '[0].currentStepRun.step')
        let stepRunId = _.get(threads, '[0].currentStepRun.id')
        if (!step) return done(new Error('No step found in thread'))
        backend.log.trace({ step: step.id }, 'Successfully queried step')

        // map all of the parameters
        let localCtx = mapInput(input, context, _.get(step, 'parameters', []))

        // everything is ready to run the task, set the task to running
        return backend.lib.S2FWorkflow(`mutation Mutation { startStepRun (id: "${step.id}") }`)
          .then(() => {
            // run specefic step type methods
            if (_.includes(HAS_SOURCE, step.type)) {
              let payload = { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId }
              return runSource.call(backend, payload, done)
            }
            return done(null)
          })
      }))
      .catch((err) => {
        console.log(chalk.red(err))
        backend.log.error({
          errors: err.message || err,
          stack: err.stack
        }, 'Failed to start step')
        return done(err)
      })
  }
}

export default runStep