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
        id: '3b5f2bf6-94c3-4b11-bd7a-2b379defe2ab'
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