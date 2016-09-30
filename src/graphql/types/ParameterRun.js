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
      create: {
        type: 'ParameterRun',
        args: {
          parameter: { type: 'String', nullable: false },
          parentId: { type: 'String', nullable: false },
          value: { type: 'FactoryJSON' }
        },
        resolve: 'createParameterRun'
      },
      update: {
        type: 'ParameterRun',
        args: {
          id: { type: 'String', nullable: false },
          value: { type: 'FactoryJSON' }
        },
        resolve: 'updateParameterRun'
      },
      delete: {
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteParameterRun'
      },
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