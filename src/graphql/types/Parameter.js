export default {
  extendFields: ['Entity', 'Named', 'Described'],
  fields: {
    type: {
      description: 'The data type of the parameter',
      type: 'ParameterTypeEnum',
      nullable: false
    },
    scope: {
      description: 'The scope of the parameter',
      type: 'ParameterScopeEnum',
      nullable: false
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
    mutable: {
      description: 'When a workflow or step is published all of its parameters become immutable',
      type: 'Boolean'
    }
  }
}