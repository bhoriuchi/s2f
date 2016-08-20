import _ from 'lodash'

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

const DEFAULT_TABLES = {
  Step: 'step',
  StepRun: 'step_run',
  Task: 'task',
  Workflow: 'workflow',
  WorkflowRun: 'workflow_run'
}

/*
 * r - rethinkdb cursor
 * opts - options hash
 * connection - rethinkdb connection object
 */
export default function RethinkDBBackend (r, opts = {}, connection) {
  let db = r.db(opts.db || 'test')
  let prefix = opts.prefix || ''
  let tables = {}

  // set the tables with either the custom or default
  _.forEach(DEFAULT_TABLES, (table, type) => {
    tables[type] = `${prefix}${_.get(opts, `tables.${type}`, table)}`
  })

  // create a table
  let createTable = function (name) {
    return dbc.tableCreate(name)
      .run()
      .then(() => true)
      .catch((err) => {
        if (err.msg.match(/^Table.*already\s+exists\.$/i) !== null) return true
        throw err
      })
  }

  /*
   * Description
   *   - Initializes a store
   *
   * Parameters
   *   * type - Store type
   *   * rebuild - boolean - destroys and recreates store, optional
   *   * seedData - array of objects - inserts data, optional
   *   * cb - error first callback - returns error/success, required
   */
  let initStore = function (type, rebuild, seedData, cb) {
    let tableName = _.get(tables, type)
    if (!tableName) throw new Error('Invalid store type')

    // analyze the arguments
    if (!_.isBoolean(rebuild)) {
      cb = seedData
      seedData = rebuild
      rebuild = false
    }
    if (_.isFunction(seedData)) {
      cb = seedData
      seedData = []
    }
    if (!_.isFunction(cb)) throw new Error('A callback is required but was not specified')

    return db.tableList()
      .filter((name) => name.eq(tableName))
      .forEach((name) => rebuild ? dbc.tableDrop(name) : dbc.table(tableName).delete())
      .run(connection)
      .then(() => createTable(tableName))
      .then(() => cb())
      .catch((err) => cb(err))
  }
}