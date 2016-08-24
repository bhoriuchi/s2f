export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
  fields: {
    parameters: {
      description: 'Global parameters',
      type: ['Parameter']
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step']
    }
  }
}