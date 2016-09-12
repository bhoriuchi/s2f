import chalk from 'chalk'
import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import s2f from '../../src/app'
import { rethinkdb as RethinkDBBackend } from '../../src/backend'
let backend = new RethinkDBBackend(rethinkdbdash({ silent: true }), graphql)
let app = s2f(backend)
import factory from 'graphql-factory'

let context = factory.utils.toObjectString({
  args: {
    id: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
  },
  context: {
    message: "hello"
  }
})

// console.log(context)

// process.exit()

app.app({
  target: 'runner',
  action: 'schedule',
  options: {
    host: 'localhost',
    port: '8091',
    action: 'startWorkflow',
    context: {
      args: {
        id: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
      },
      context: {
        message: "hello"
      }
    }
  }
})
.then((res) => {
  console.log(chalk.green(res))
  process.exit()
})
.catch((err) => {
  console.log(chalk.red(err))
  process.exit()
})