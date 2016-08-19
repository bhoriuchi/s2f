export default {
  extendFields: ['Named', 'Described'],
  fields: {
    type: {
      description: 'The data type of the parameter',
      type: 'ParameterTypeEnum',
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
    default: {
      description: 'Default value',
      type: 'String'
    }
  }
}