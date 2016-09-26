import _ from 'lodash'
import { YellowjacketRethinkDBBackend } from 'yellowjacket'
import FactoryTemporalPlugin from 'graphql-factory-temporal'
import { rethinkdb as FactoryTemporalBackend } from 'graphql-factory-temporal/backend'
import { mergeConfig, temporalTables } from '../util'
import functions from './functions/index'
import actions from '../../actions/index'
import installData from '../../data/index'

export class S2fRethinkDBBackend extends YellowjacketRethinkDBBackend {
  constructor (namespace, graphql, r, config = {}, connection) {
    config = mergeConfig(config)

    // create a temporal plugin
    let temporalOptions = { tables: temporalTables(), prefix: config.prefix }
    let temporalBackend = new FactoryTemporalBackend(r, graphql, temporalOptions, connection)
    let temporalPlugin = FactoryTemporalPlugin(temporalBackend)

    // merge plugins
    config.plugin = _.union([ temporalPlugin ], _.isArray(config.plugin) ? config.plugin : [])

    super(namespace, graphql, r, config, connection)
    this.type = 'S2fRethinkDBBackend'

    // add data
    this.addInstallData(installData)

    // add functions
    this.addFunctions(functions(this))

    // add actions
    this.addActions(actions(this))
  }
}

// helper function to instantiate a new backend
export default function (namespace, graphql, r, config, connection) {
  return new S2fRethinkDBBackend(namespace, graphql, r, config, connection)
}