import _ from 'lodash'
import chalk from 'chalk'

export function pretty (obj, path) {
  obj = _.get(obj, path, obj)
  return JSON.stringify(obj, null, '  ')
}

export function makeError (getopt) {
  return function (msg, showHelp = false, terminate = true) {
    console.error(chalk.red('ERROR:', msg))
    if (showHelp) getopt.showHelp()
    if (terminate) process.exit()
  }
}

export default {
  pretty,
  makeError
}