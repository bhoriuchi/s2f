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