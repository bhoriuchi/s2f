let versionArgs = {
  id: { type: 'String' },
  recordId: { type: 'String' },
  version: { type: 'String' },
  date: { type: 'TemporalDateTime' }
}

export default {
  fields: {
    now: {
      type: 'TemporalDateTime',
      resolve: 'now'
    },
    readWorkflow: {
      type: ['Workflow'],
      args: versionArgs,
      resolve: 'readWorkflow'
    },
    readStep: {
      type: ['Step'],
      args: versionArgs,
      resolve: 'readStep'
    },
    readTask: {
      type: ['Task'],
      args: versionArgs,
      resolve: 'readTask'
    },
    readParameter: {
      type: ['Step'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameter'
    }
  }
}