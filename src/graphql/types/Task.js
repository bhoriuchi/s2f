export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
  fields: {
    source: {
      type: 'String',
      nullable: false
    },
    parameters: {
      type: ['Parameter'],
      resolve: 'readParameter'
    }
  }
}