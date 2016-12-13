import _ from 'lodash'
import obj2arg from 'graphql-obj2arg'
import createWorkflowRun from './createWorkflowRun'
import { gqlResult, convertType } from '../common'

import chalk from 'chalk'

export default function startWorkflow (backend) {
  return function (runner, task, done) {
    let { context: { args, input, parent } } = task
    let taskId = task.id

    input = input || {}
    if (!args) return done(new Error('No context was supplied'))

    console.log(chalk.cyan('==========================='))
    console.log(chalk.cyan(JSON.stringify(task, null, '  ')))
    console.log(chalk.cyan('==========================='))

    return backend.lib.S2FWorkflow(`{
      readWorkflow (${obj2arg(args, { noOuterBraces: true })}) {
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
          subWorkflow {
            _temporal { recordId },
            id
          },
          timeout,
          failsWorkflow,
          waitOnSuccess,
          requireResumeKey,
          success,
          fail,
          parameters { id, name, type, class, required, mapsTo, defaultValue }
        }
      }
    }`, {}, args)
      .then((result) => gqlResult(backend, result, (err, data) => {
        let wf = _.get(data, 'readWorkflow[0]')
        let step = _.get(wf, 'steps[0]')
        if (err) throw err
        if (!wf) throw new Error('No workflow found')
        if (!step || step.type === 'END') throw new Error('The workflow contains no valid steps')

        backend.log.trace({ server: backend._server, workflow: wf.id }, 'Successfully queried workflow')

        // check that all required inputs are provided and that the types are correct
        // also convert them at this time
        // using a for loop to allow thrown errors to be caught by promise catch
        for (const i of wf.inputs) {
          if (i.required && !_.has(input, i.name)) throw new Error(`missing required input ${i.name}`)
          if (_.has(input, i.name)) input[i.name] = convertType(i.type, i.name, input[i.name])
        }

        // run the
        return createWorkflowRun.call(backend, runner, { taskId, args, input, parent }, done, wf)
      }))
      .catch((err) => {
        console.log(err)
        backend.log.error({
          errors: err.message || err,
          stack: err.stack
        }, 'Failed to start workflow')
        return done(err)
      })
  }
}