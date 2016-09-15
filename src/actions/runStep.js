import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult, convertType } from './common'
import StepTypes from '../graphql/types/StepTypeEnum'
import ParameterClass from '../graphql/types/ParameterClassEnum'
import sbx from 'sbx'

let { values: { ATTRIBUTE, INPUT, OUTPUT } } = ParameterClass
let { values: { BASIC, CONDITION, END, FORK, JOIN, LOOP, START, TASK, WORKFLOW } } = StepTypes
let HAS_SOURCE = [ BASIC, CONDITION, LOOP, TASK ]

export function runSource (context, runner, globalContext, args, step, done) {
  let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step
  if (!source) return done(new Error('No source'))
  return sbx.vm(source, _.merge({ context, timeout }, this._vm))
    .then((ctx) => {
      let failed = ctx._exception || ctx._result === false

      switch (step.type) {
        case CONDITION:
        case LOOP:
        case BASIC:
        case TASK:
        default:
      }

      console.log(chalk.green(JSON.stringify(ctx, null, '  ')))
      done()
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
  let { Workflow } = backend
  return function (runner, context = {}, done) {
    let { workflowRun, thread } = context
    if (!workflowRun || !thread) return done(new Error('No workflow run or main thead created'))

    return Workflow(`{
      readWorkflowRun (id: "${workflowRun}") {
        args,
        input,
        context {
          parameter { id, name, type, scope, class },
          value
        },
        threads (id: "${thread}") {
          currentStepRun {
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
        let { args, input, context, threads } = _.get(data, 'readWorkflowRun[0]', {})
        let step = _.get(threads, '[0].currentStepRun.step')
        if (!step) return done(new Error('No step found in thread'))
        backend.logTrace('Successfully queried step', { step: step.id })

        // map all of the parameters
        let localCtx = mapInput(input, context, _.get(step, 'parameters', []))

        // everything is ready to run the task, set the task to running
        return Workflow(`mutation Mutation { startStepRun (id: "${step.id}") }`)
          .then(() => {
            // run specefic step type methods
            if (_.includes(HAS_SOURCE, step.type)) {
              return runSource.call(backend, runner, localCtx, context, args, step, done)
            }
            return done(null)
          })
      }))
      .catch((err) => {
        console.log(chalk.red(err))
        backend.logError('Failed to start step', {
          errors: err.message || err,
          stack: err.stack
        })
        return done(err)
      })
  }
}

export default runStep