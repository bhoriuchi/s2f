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
        // id: 'a0982a11-316a-4558-ba6e-969fdf90c182' // unpublished sub
        // id: '4b38805a-a95a-4bb2-b28c-2d7c17d08299' // published sub
        id: '3f287eca-d8ad-47cd-9bbb-d86959e405b8' // logic
      },
      input: {
        // name: 'JOHN'
        bool: false
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