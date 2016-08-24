export const DEFAULT_TABLES = {
  Workflow: {
    name: 'workflow',
    unique: ['name']
  },
  WorkflowRun: {
    name: 'workflow_run',
    unique: []
  }
}

// create a table
export function createTable (dbc, name) {
  return dbc.tableCreate(name)
    .run()
    .then(() => true)
    .catch((err) => {
      if (err.msg.match(/^Table.*already\s+exists\.$/i) !== null) return true
      throw err
    })
}