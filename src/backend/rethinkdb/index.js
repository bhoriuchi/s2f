/*
 * s2f backend for RethinkDB
 *
 * Backend Guidelines
 * - Backends for other stores should provide the same functions.
 * - The parameters for the main backend function do not need to match this ones
 * - The main backend function should return a hash of functions
 * - The functions are used as resolve functions in graphql-factory and you can take
 *   advantage of shortcut/helper methods provided if you like
 * - Functions have their required output defined
 */
import _ from 'lodash'
import TemporalPlugin from 'graphql-factory-temporal'
import { rethinkdb as TemporalBackend } from 'graphql-factory-temporal/backend'
import { createTable, DEFAULT_TABLES } from './common'
// import createWorkflow from './createWorkflow'
import { create as createWorkflow } from './workflow'
import getWorkflow from './getWorkflow'

/*
 * r - rethinkdb cursor
 * opts - options hash
 * connection - rethinkdb connection object
 */
function RethinkDBBackend (r, graphql, opts = {}, connection) {
  this._r = r
  this._graphql = graphql
  this._connection = connection
  this._db = r.db(opts.db || 'test')
  this._prefix = opts.prefix || ''
  this._tables = {}
  this.functions = {}

  // set the tables with either the custom or default
  _.forEach(DEFAULT_TABLES, (table, type) => {
    this._tables[type] = {
      table: `${this._prefix}${_.get(opts, `tables.${type}.name`, table.name)}`,
      unique: _.get(opts, `tables.${type}.unique`, table.unique)
    }
  })

  // initialize the temporal plugin
  let backendOptions = { tables: this._tables, prefix: this._prefix }
  let temporalBackend = new TemporalBackend(this._r, this._graphql, backendOptions, this._connection)
  this.plugin = TemporalPlugin(temporalBackend)

  this.functions = {
    createWorkflow: createWorkflow(this),
    getWorkflow: getWorkflow(this._r, this._connection)
  }
}


RethinkDBBackend.prototype.initStore = function (type, rebuild, seedData) {
  let dbc = this._db
  let tableName = _.get(this._tables, `${type}.table`)
  if (!tableName) throw new Error('Invalid table config')

  // analyze the arguments
  if (!_.isBoolean(rebuild)) {
    seedData = _.isArray(rebuild) ? rebuild : []
    rebuild = false
  }

  return dbc.tableList()
    .filter((name) => name.eq(tableName))
    .forEach((name) => rebuild ? dbc.tableDrop(name) : dbc.table(tableName).delete())
    .run(this._connection)
    .then(() => createTable(dbc, tableName))
}

RethinkDBBackend.prototype.initAllStores = function (rebuild, seedData) {
  if (!_.isBoolean(rebuild)) {
    seedData = _.isObject(rebuild) ? rebuild : {}
    rebuild = false
  }

  let ops = _.map(this._tables, (t, type) => {
    let data = _.get(seedData, type, [])
    return this.initStore(type, rebuild, _.isArray(data) ? data : [])
  })

  return Promise.all(ops)
}

RethinkDBBackend.prototype.install = function () {
  return this.initAllStores(true)
}

export default RethinkDBBackend