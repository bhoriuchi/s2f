import _ from 'lodash'
import chalk from 'chalk'
import { gqlResult } from './common'

export function runStep (backend) {
  let { Workflow } = backend
  return function (runner, context = {}, done) {
    return Workflow(`{
      readWorkflowRun (id: "${context.id}") {
        args,
        input,
        context {
          parameter { id, name, type, scope, class },
          value
        },
        threads {
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
        console.log(chalk.green(JSON.stringify(data, null, '  ')))
        return done(null)
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