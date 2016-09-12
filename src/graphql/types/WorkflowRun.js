export default {
  extendFields: ['Entity'],
  fields: {
    workflow: {
      type: 'Workflow'
    },
    args: {
      type: 'FactoryJSON'
    },
    input: {
      type: 'FactoryJSON'
    },
    context: {
      type: ['ParameterRun']
    },
    threads: {
      type: ['WorkflowRunThread']
    }
  }
}