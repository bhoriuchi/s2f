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
      args: {
        id: { type: 'String' },
        recordId: { type: 'String' },
        version: { type: 'String' },
        date: { type: 'TemporalDateTime' }
      },
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
    },
    readWorkflowRun: {
      type: ['WorkflowRun'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readWorkflowRun'
    },
    readWorkflowRunThread: {
      type: ['WorkflowRunThread'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readWorkflowRunThread'
    },
    readStepRun: {
      type: ['StepRun'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readStepRun'
    },
    readParameterRun: {
      type: ['ParameterRun'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameterRun'
    }
  }
}