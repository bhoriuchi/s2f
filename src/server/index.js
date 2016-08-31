import _ from 'lodash'
import GetOpt from 'node-getopt'
import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as RethinkDBBackend } from '../backend'
import gql from '../graphql'
import addNode from './add'

let getopt = new GetOpt([
  ['', 'config=ARG', 'Configuration file'],
  ['', 'add', 'Adds a new node'],
  ['', 'remove', 'Removes an existing node'],
  ['', 'update', 'Update node configuration'],
  ['', 'start', 'Start the server'],
  ['', 'cmd=ARG', 'Sends a command'],
  ['h', 'host=ARG', 'Host name or IP'],
  ['p', 'port=ARG', 'Port number (default 8080)'],
  ['r', 'role=ARG', 'Assigns a role']
])

getopt.setHelp(`
Usage: node s2f.js --config <config.json> [operation] [command | options...]
  operation:
    --add       : adds a new node
    --remove    : removes an existing node
    --update    : updates an existing node
    --start     : starts a node
    --cmd       : sends a command
  options:
    -h --host   : host name or ip
    -p --port   : host port (default 8080)
    -r --role   : assigns a role
  commands:
    stop        : stops node
    restart     : restarts node
    info        : prints info about node
    list        : prints cluster node config
    changerole  : changes node role
    maintenance : pust node into maintenance
`)

function error (msg, showHelp) {
  console.error(chalk.red('ERROR:', msg))
  if (showHelp) getopt.showHelp()
  process.exit()
}

function pretty (obj, path) {
  obj = _.get(obj, path, obj)
  return JSON.stringify(obj, null, '  ')
}

let opts = getopt.parseSystem()

// create a reusable helper object
let helper = { options: opts.options, error, pretty}

// get the options
let { config, add, remove, update, start, cmd, host, port, role } = opts.options

// check for config file
if (!config) {
  error('A config file is required but was not specified', true)
}

let configFile = path.resolve(config)
let configData = {}

try {
  configData = fs.readFileSync(configFile, { encoding: 'utf8' })
  configData = JSON.parse(configData)
} catch (err) {
  if (err.code === 'ENOENT') error(`Could not read config file ${configFile}`)
  else if (err instanceof SyntaxError) error(`Failed to parse config file ${configFile}. Please ensure that it is in JSON format`)
  else error('Unknown error')
}

// set up the backend
let be = _.get(configData, 'backend', {})
let getLib = function () {
  if (be.type === 'rethinkdb') {
    return gql(new RethinkDBBackend(rethinkdbdash(), graphql))
  } else {
    error('Cannot determine backend type, exiting')
  }
}

// perform operations
if (add) {
  addNode(getLib(), helper)
} else if (remove) {
  console.log('REMOVING')
} else if (update) {
  console.log('UPDATING')
} else if (start) {
  console.log('STARTING')
} else if (cmd) {
  console.log('COMMAND')
} else {
  error('No action specified. add, remove, update, start, or cmd must be specified', true)
}