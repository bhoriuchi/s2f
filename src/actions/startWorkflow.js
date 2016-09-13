import _ from 'lodash'
import chalk from 'chalk'
import factory from 'graphql-factory'
import { gqlResult, convertType } from './common'
let { toObjectString } = factory.utils

export function createWorkflowRun (runner, context, done, wf) {
  return done(null)
}

export function startWorkflow (backend) {
  let { Workflow } = backend
  return function (runner, context = {}, done) {
    let { args, input } = context
    if (!args) return done(new Error('No context was supplied'))

    return Workflow(`{
      readWorkflow (${toObjectString(args).replace(/^{|}$/g, '')}) {
        _temporal { recordId },
        id,
        name,
        inputs { id, name, type, required, defaultValue },
        parameters { id, name, type, required, defaultValue },
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
        if (err) throw err
        if (!wf) throw new Error('No workflow found')
        if (!_.get(wf, 'steps[0]')) throw new Error('The workflow contains no valid steps')

        backend.logTrace('Got first step in workflow')

        console.log(chalk.blue(JSON.stringify(wf, null, '  ')))

        // check that all required inputs are provided and that the types are correct
        for (const key in wf.inputs) {
          let i = wf.inputs[key]
          if (i.required && !_.has(input, i.name)) throw new Error(`missing required input ${key}`)
          if (_.has(input, i.name)) convertType(i.type, input[i.name])
        }

        return createWorkflowRun.call(backend, runner, context, done, wf)
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