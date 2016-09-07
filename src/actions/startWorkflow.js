import _ from 'lodash'
import chalk from 'chalk'
import factory from 'graphql-factory'
import { gqlResult } from './common'
let { toObjectString } = factory.utils

export function startWorkflow (backend) {
  let { Workflow } = backend
  return function (runner, context = {}, done) {
    let { args, input } = context
    if (!args) return done(new Error('No context was supplied'))

    return Workflow(`{
      readWorkflow (${toObjectString(args).replace(/^{|}$/g, '')}) {
        _temporal {
          recordId
        },
        id,
        name,
        parameters {
          name,
          type,
          required,
          defaultValue
        },
        steps (first: true) {
          id,
          name,
          type,
          async,
          source,
          task {
            source,
            parameters {
              name,
              type,
              scope,
              required,
              mapsTo,
              defaultValue
            }
          },
          subWorkflow,
          timeout,
          failsWorkflow,
          waitOnSuccess,
          requireResumeKey,
          success,
          fail,
          parameters {
            name,
            type,
            scope,
            required,
            mapsTo,
            defaultValue
          }
        }
      }
    }`)
      .then((result) => gqlResult(backend, result, (err, data) => {
        if (err) throw err
        backend.logInfo('i made it')
        let s = JSON.stringify(data, null, '  ')
        console.log(chalk.blue(s))
      }))
      .catch((err) => {
        backend.logError('Failed to start workflow', {
          errors: err.message || err,
          stack: err.stack
        })
      })
  }
}

export default startWorkflow