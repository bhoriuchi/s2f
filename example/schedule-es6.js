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
        id: 'f2561c24-8b42-492a-9c0c-d75edb47e4f2'
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