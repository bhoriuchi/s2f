import _ from 'lodash'
import { YellowjacketRethinkDBBackend } from 'yellowjacket'
import { mergeConfig } from '../util'
import functions from './functions/index'

export class S2fRethinkDBBackend extends YellowjacketRethinkDBBackend {
  constructor (namespace, graphql, r, config = {}, connection) {
    config = mergeConfig(config)
    super(namespace, graphql, r, config, connection)
    this.type = 'S2fRethinkDBBackend'

    // add functions
    this.addFunctions(functions(this))
  }
}

// helper function to instantiate a new backend
export default function (namespace, graphql, r, config, connection) {
  return new YellowjacketRethinkDBBackend(namespace, graphql, r, config, connection)
}