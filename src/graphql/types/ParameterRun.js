export default {
  extendFields: ['Entity', 'Named'],
  fields: {
    parameterId: {
      description: 'Parameter this run maps to',
      type: 'String',
      nullable: false
    },
    stepRunId: {
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