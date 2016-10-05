import chalk from 'chalk'
import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
let backend = new RethinkDBBackend('_s2f', graphql, rethinkdbdash({ silent: true }))

let client = backend.client({ loglevel: 'trace' })
client.emit(
  'localhost',
  8091,
  'workflow',
  {
    query: `{ readWorkflow { id, name } }`
  }, // payload
  {
    result: ({ payload }) => {
      console.log(JSON.stringify(payload, null, '  '))
      process.exit()
    }
  }, // listeners
  (error) => {
    console.log(error)
    process.exit()
  }
)

// catch all timeout
setTimeout(() => {
  process.exit()
}, 5000)