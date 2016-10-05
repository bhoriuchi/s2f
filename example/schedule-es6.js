import chalk from 'chalk'
import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
let backend = new RethinkDBBackend('_s2f', graphql, rethinkdbdash({ silent: true }))

backend.cmd({
  target: 'runner',
  action: 'schedule',
  options: {
    host: 'localhost',
    port: '8091',
    action: 'startWorkflow',
    context: {
      args: {
        id: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
      },
      input: {
        name: 'Dam Son'
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