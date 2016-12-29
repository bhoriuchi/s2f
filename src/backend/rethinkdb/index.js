import _ from 'lodash'
import chalk from 'chalk'
import { YellowjacketRethinkDBBackend } from 'yellowjacket'
import FactoryTemporalPlugin from 'graphql-factory-temporal'
import { GraphQLFactoryTemporalRethinkDBBackend } from 'graphql-factory-temporal/backend'
import { mergeConfig } from '../util'
import events from '../../events/index'
import functions from './functions/index'
import actions from '../../actions/index'
import installData from '../../data/index'

export class S2fRethinkDBBackend extends YellowjacketRethinkDBBackend {
  constructor (namespace, graphql, r, config = {}, connection) {
    config = mergeConfig(config)

    let { types, options } = config

    // create a temporal plugin
    let temporalOptions = { types, prefix: _.get(options, 'prefix', ''), store: _.get(options, 'store', 'test') }
    let temporalBackend = new GraphQLFactoryTemporalRethinkDBBackend(r, graphql, temporalOptions, connection)
    let temporalPlugin = FactoryTemporalPlugin(temporalBackend)

    // merge plugins
    config.plugin = _.union([ temporalPlugin ], _.isArray(config.plugin) ? config.plugin : [])

    super(namespace, graphql, r, config, connection)
    this.type = 'S2fRethinkDBBackend'

    // add data
    this.addInstallData(installData)

    // add functions
    this.addFunctions(functions)

    // add actions
    this.addActions(actions(this))

    // add events
    this.addEvents(events)
  }
}

// helper function to instantiate a new backend
export default function (namespace, graphql, r, config, connection) {
  return new S2fRethinkDBBackend(namespace, graphql, r, config, connection)
}