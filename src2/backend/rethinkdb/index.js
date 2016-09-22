import _ from 'lodash'
import { YellowjacketRethinkDBBackend } from 'yellowjacket'
import { mergeConfig } from '../util'
import functions from './functions/index'
import actions from '../../actions/index'
import installData from '../../data/index'

export class S2fRethinkDBBackend extends YellowjacketRethinkDBBackend {
  constructor (namespace, graphql, r, config = {}, connection) {
    config = mergeConfig(config)
    super(namespace, graphql, r, config, connection)
    this.type = 'S2fRethinkDBBackend'

    // add data
    this.addInstallData(installData)

    // add functions
    this.addFunctions(functions(this))

    // add actions
    super.addActions(actions(this))
  }
}

// helper function to instantiate a new backend
export default function (namespace, graphql, r, config, connection) {
  return new S2fRethinkDBBackend(namespace, graphql, r, config, connection)
}