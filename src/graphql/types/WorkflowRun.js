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
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameterRun'
    },
    threads: {
      type: ['WorkflowRunThread'],
      args: {
        id: { type: 'String' }
      },
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
    },
    parentStepRun: {
      type: 'String'
    }
  }
}