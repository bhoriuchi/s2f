export default {
  extendFields: ['Entity'],
  fields: {
    context: {
      type: ['ParameterRun'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameterRun'
    },
    step: {
      description: 'The step associated with this run',
      type: 'Step',
      resolve: 'readStep'
    },
    started: {
      type: 'FactoryDateTime'
    },
    ended: {
      type: 'FactoryDateTime'
    },
    status: {
      type: 'RunStatusEnum'
    }
  }
}