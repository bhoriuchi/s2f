/*
 * s2f command line builder
 *
 * This module exports a function that expects an s2f backend as its first argument
 * optionally if you do not want to use the cli an options hash can be passed as the second argument
 *
 */
import gql from '../graphql'
import getOptions from './options'
import addNode from './add'
import runCommand from './command'
import startServer from './start'
import { pretty, makeError } from './common'

export default function (backend, options) {
  let getopt = options ? () => { showHelp: () => true } : getOptions()
  let error = makeError(getopt)
  if (!backend) error('A backend is required but was not supplied')
  let opts = options ? options : getopt.parseSystem().options
  let lib = gql(backend)
  let helper = { options: opts, error, pretty}
  let { add, remove, update, start, cmd } = opts

  // perform operations
  if (add) addNode(lib, helper)
  else if (remove) console.log('REMOVING')
  else if (update) console.log('UPDATING')
  else if (start) startServer(lib, helper)
  else if (cmd) runCommand(lib, helper)
  else error('No action specified. add, remove, update, start, or cmd must be specified', true)
}