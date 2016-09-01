import chalk from 'chalk'

export default function (backend) {
  return backend.install().then(function (res) {
    console.log(chalk.blue('Install Summary'))
    console.log(chalk.blue(JSON.stringify(res, null, '  ')))
    process.exit()
  }).catch(function (err) {
    console.error(chalk.red(err))
    process.exit()
  })
}