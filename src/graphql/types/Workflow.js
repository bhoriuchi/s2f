export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
  fields: {
    inputs: {
      description: 'Inputs from steps',
      type: ['Parameter'],
      resolve: 'readWorkflowInputs'
    },
    parameters: {
      description: 'Global parameters',
      type: ['Parameter'],
      resolve: 'readParameter'
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step'],
      args: {
        first: 'Boolean'
      },
      resolve: 'readStep'
    }
  }
}