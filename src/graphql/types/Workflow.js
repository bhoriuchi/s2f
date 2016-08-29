export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
  fields: {
    parameters: {
      description: 'Global parameters',
      type: ['Parameter'],
      resolve: 'readParameter'
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step'],
      resolve: 'readStep'
    }
  }
}