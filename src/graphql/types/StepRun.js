export default {
  extendFields: ['Entity'],
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