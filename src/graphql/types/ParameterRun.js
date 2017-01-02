export default {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    parameter: {
      type: 'Parameter',
      has: 'id'
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
    collection: 'parameter_run',
    mutation: {
      create: false,
      update: false,
      delete: false,
      updateAttributeValues: {
        type: 'Boolean',
        args: {
          values: { type: ['ParameterRunValueInput'], nullable: false }
        },
        resolve: 'updateAttributeValues'
      }
    }
  }
}