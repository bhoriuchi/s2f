export default {
  type: ['Object', 'Input'],
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    name: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    type: {
      description: 'The data type of the parameter',
      type: 'ParameterTypeEnum',
      nullable: false
    },
    scope: {
      description: 'The scope of the parameter',
      type: 'ParameterScopeEnum',
      nullable: false,
      omitFrom: 'Input',
      uniqueWith: 'uniqueparam'
    },
    class: {
      description: 'Class of parameter',
      type: 'ParameterClassEnum',
      uniqueWith: 'uniqueparam'
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
      uniqueWith: 'uniqueparam',
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
    query: {
      read: true
    },
    mutation: {
      create: false,
      update: false,
      delete: false
    }
  }
}