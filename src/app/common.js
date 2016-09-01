import _ from 'lodash'
import chalk from 'chalk'

export const DEFAULT_HTTP_PORT = 8080

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
  DEFAULT_HTTP_PORT,
  pretty,
  makeError
}