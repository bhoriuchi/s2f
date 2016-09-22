export default {
  extendFields: ['Entity'],
  fields: {
    parameter: {
      type: 'Parameter',
      resolve: 'readParameter'
    },
    parentId: {
      type: 'String',
      belongsTo: {
        WorkflowRun: { context: 'id' },
        StepRun: { context: 'id' }
      }
    },
    value: {
      type: 'FactoryJSON'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'parameter_run'
  }
}