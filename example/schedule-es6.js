import chalk from 'chalk'
import backend from './backend'

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