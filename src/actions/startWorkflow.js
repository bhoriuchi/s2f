import _ from 'lodash'
import chalk from 'chalk'
import factory from 'graphql-factory'
import { gqlResult, convertType } from './common'
let { toObjectString, Enum } = factory.utils

export function createWorkflowRun (runner, context, done, wf) {
  let { args, input } = context
  let step = wf.steps[0]

  // convert enums
  step.type = Enum(step.type)
  _.forEach(step.parameters, (param) => {
    param.class = Enum(param.class)
    param.type = Enum(param.type)
  })
  _.forEach(wf.parameters, (param) => {
    param.class = Enum(param.class)
    param.type = Enum(param.type)
  })

  return this.Workflow(`mutation Mutation {
    createWorkflowRun (
      workflow: "${wf.id}",
      args: ${toObjectString(args)},
      input: ${toObjectString(input)},
      parameters: ${toObjectString(wf.parameters)},
      step: ${toObjectString(step)}
    ) {
      id,
      workflow { name },
      args,
      input,
      context { parameter { name }, value },
      threads {
        currentStepRun { step { name } },
        stepRuns { step { name } },
        status
      },
      started,
      ended,
      status
    }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err
      console.log(chalk.green(JSON.stringify(data, null, '  ')))
      return done(null)
    }))
    .catch((err) => {
      return done(err)
    })
}

export function startWorkflow (backend) {
  let { Workflow } = backend
  return function (runner, context = {}, done) {
    let { args, input } = context
    input = input || {}
    if (!args) return done(new Error('No context was supplied'))

    return Workflow(`{
      readWorkflow (${toObjectString(args, { noOuterBraces: true })}) {
        _temporal { recordId },
        id,
        name,
        inputs { id, name, type, class, required, defaultValue },
        parameters { id, name, class, type, required, defaultValue },
        steps (first: true) {
          id,
          name,
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
          parameters { id, name, type, class, required, mapsTo, defaultValue }
        }
      }
    }`)
      .then((result) => gqlResult(backend, result, (err, data) => {
        let wf = _.get(data, 'readWorkflow[0]')
        let step = _.get(wf, 'steps[0]')
        if (err) throw err
        if (!wf) throw new Error('No workflow found')
        if (!step || step.type === 'END') throw new Error('The workflow contains no valid steps')

        backend.logTrace('Successfully queried workflow', { workflow: wf.id })

        // console.log(chalk.blue(JSON.stringify(wf, null, '  ')))

        // check that all required inputs are provided and that the types are correct
        // also convert them at this time
        // using a for loop to allow thrown errors to be caught by promise catch
        for (const i of wf.inputs) {
          if (i.required && !_.has(input, i.name)) throw new Error(`missing required input ${i.name}`)
          if (_.has(input, i.name)) input[i.name] = convertType(i.type, i.name, input[i.name])
        }

        // run the
        return createWorkflowRun.call(backend, runner, { args, input }, done, wf)
      }))
      .catch((err) => {
        console.log(chalk.red(err))
        backend.logError('Failed to start workflow', {
          errors: err.message || err,
          stack: err.stack
        })
        return done(err)
      })
  }
}

export default startWorkflow