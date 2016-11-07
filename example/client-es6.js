import chalk from 'chalk'
import backend from './backend'

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