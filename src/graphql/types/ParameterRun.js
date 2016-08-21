export default {
  extendFields: ['Entity', 'Named'],
  fields: {
    parameter: {
      description: 'Parameter this run maps to',
      type: 'String',
      nullable: false
    },
    step: {
      description: 'Step this run maps to',
      type: 'String',
      nullable: false
    },
    value: {
      description: 'Parameter value',
      type: 'String'
    }
  }
}