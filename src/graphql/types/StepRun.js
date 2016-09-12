export default {
  extendFields: ['Entity', 'Named'],
  fields: {
    context: {
      type: ['ParameterRun']
    },
    step: {
      description: 'The step associated with this run',
      type: 'Step'
    }
  }
}