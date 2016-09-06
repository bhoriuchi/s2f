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
import { createTable, DEFAULT_TABLES, now } from './common'
import { createWorkflow, readWorkflow, updateWorkflow, deleteWorkflow } from './workflow'
import { createStep, readStep, updateStep, deleteStep } from './step'
import { createParameter, readParameter, updateParameter, deleteParameter } from './parameter'
import { createTask, readTask, updateTask, deleteTask } from './task'

// import yellowjacket task runner
import yellowjacket from 'yellowjacket'
import yjinstaller from 'yellowjacket/install'
import { rethinkdb as YJBackend } from 'yellowjacket/backend'

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
  this.actions = {}
  this.scheduler = opts.scheduler || function (runner, nodes, queue, done) { return done(null, [runner.info()]) }
  // runner
  this._runnerBackend = new YJBackend(this._r, this._graphql)
  this.cli = () => yellowjacket(this._runnerBackend, undefined, this.actions, this.scheduler)

  // set the tables with either the custom or default
  _.forEach(DEFAULT_TABLES, (table, type) => {
    this._tables[type] = {
      table: `${this._prefix}${_.get(opts, `tables.${type}.table`, table.table)}`,
      unique: _.get(opts, `tables.${type}.unique`, table.unique),
      temporal: table.temporal
    }
  })

  // temporal tables
  let temporalTables = _.omitBy(this._tables, (cfg) => !cfg.temporal)

  // initialize the temporal plugin
  let backendOptions = { tables: temporalTables, prefix: this._prefix }
  let temporalBackend = new TemporalBackend(this._r, this._graphql, backendOptions, this._connection)
  this.plugin = TemporalPlugin(temporalBackend)

  this.functions = {
    // util functions
    now: now(this),

    // workflow
    createWorkflow: createWorkflow(this),
    readWorkflow: readWorkflow(this),
    updateWorkflow: updateWorkflow(this),
    deleteWorkflow: deleteWorkflow(this),

    // step
    createStep: createStep(this),
    readStep: readStep(this),
    updateStep: updateStep(this),
    deleteStep: deleteStep(this),

    // parameter
    createParameter: createParameter(this),
    readParameter: readParameter(this),
    updateParameter: updateParameter(this),
    deleteParameter: deleteParameter(this),

    // task
    createTask: createTask(this),
    readTask: readTask(this),
    updateTask: updateTask(this),
    deleteTask: deleteTask(this),
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
  return this.initAllStores(true).then(() => yjinstaller(this._runnerBackend))
}

export default RethinkDBBackend