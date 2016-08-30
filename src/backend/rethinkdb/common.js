export const DEFAULT_TABLES = {
  Workflow: {
    name: 'workflow',
    unique: ['name']
  },
  WorkflowRun: {
    name: 'workflow_run',
    unique: []
  },
  Step: {
    name: 'step',
    unique: []
  },
  Parameter: {
    name: 'parameter',
    unique: []
  },
  Task: {
    name: 'task',
    unique: []
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

export default {
  DEFAULT_TABLES,
  createTable,
  isPublished
}