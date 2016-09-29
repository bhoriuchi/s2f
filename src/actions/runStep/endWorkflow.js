import chalk from 'chalk'

export default function endWorkflow (workflowRun, done) {
  console.log(chalk.green('==== NEXT STEP IS END'))
  done()
}