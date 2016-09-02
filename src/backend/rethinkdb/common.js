export const DEFAULT_TABLES = {
  Workflow: {
    table: 'workflow',
    unique: ['name'],
    temporal: true
  },
  WorkflowRun: {
    table: 'workflow_run',
    unique: [],
    temporal: false
  },
  Step: {
    table: 'step',
    unique: [],
    temporal: true
  },
  Parameter: {
    table: 'parameter',
    unique: [],
    temporal: false
  },
  Task: {
    table: 'task',
    unique: ['name'],
    temporal: true
  },
  RunQueue: {
    table: 'run_queue',
    unique: [],
    temporal: false
  },
  ClusterNode: {
    table: 'cluster_node',
    unique: [],
    temporal: false
  }
}

// create a table
export function createTable (dbc, name) {
  return dbc.tableCreate(name)
    .run()
    .then(() => `${name} Created`)
    .catch((err) => {
      if (err.msg.match(/^Table.*already\s+exists\.$/i) !== null) return `${name} Exists`
      throw err
    })
}

export function isPublished (backend, type, id) {
  let r = backend._r
  let table = backend._db.table(backend._tables[type].table)
  return table.get(id)
    .do((obj) => {
      return r.branch(
        obj.eq(null),
        r.error(`${type} does not exist`),
        r.branch(
          obj('_temporal')('version').ne(null),
          true,
          false
        )
      )
    })
}

export function now (backend) {
  return function () {
    return backend._r.now().run(backend._connection)
  }
}

export default {
  DEFAULT_TABLES,
  createTable,
  isPublished,
  now
}