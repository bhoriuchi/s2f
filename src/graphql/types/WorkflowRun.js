export default {
  extendFields: ['Entity'],
  fields: {
    workflow: {
      type: 'Workflow',
      resolve: 'readWorkflow'
    },
    args: {
      type: 'FactoryJSON'
    },
    input: {
      type: 'FactoryJSON'
    },
    context: {
      type: ['ParameterRun'],
      resolve: 'readParameterRun'
    },
    threads: {
      type: ['WorkflowRunThread'],
      resolve: 'readWorkflowRunThread'
    },
    started: {
      type: 'FactoryDateTime'
    },
    ended: {
      type: 'FactoryDateTime'
    },
    status: {
      type: 'RunStatusEnum'
    }
  }
}