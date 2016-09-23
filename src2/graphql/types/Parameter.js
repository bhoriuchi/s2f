export default {
  type: ['Object', 'Input'],
  extendFields: ['S2FEntity', 'S2FNamed', 'S2FDescribed'],
  fields: {
    type: {
      description: 'The data type of the parameter',
      type: 'ParameterTypeEnum',
      nullable: false
    },
    scope: {
      description: 'The scope of the parameter',
      type: 'ParameterScopeEnum',
      nullable: false,
      omitFrom: 'Input'
    },
    class: {
      description: 'Class of parameter',
      type: 'ParameterClassEnum'
    },
    required: {
      description: 'Parameter is required',
      type: 'Boolean',
      nullable: false
    },
    mapsTo: {
      description: 'Name of global context parameter to map',
      type: 'String'
    },
    defaultValue: {
      description: 'Default value',
      type: 'String'
    },
    parentId: {
      description: 'Object the parameter belongs to',
      type: 'String',
      belongsTo: {
        Workflow: { parameters: 'id' },
        Step: { parameters: 'id' },
        Task: { parameters: 'id' }
      }
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'parameter',
    mutation: {
      create: {
        resolve: 'createParameter'
      },
      update: {
        resolve: 'updateParameter'
      },
      delete: {
        resolve: 'deleteParameter'
      }
    }
  }
}