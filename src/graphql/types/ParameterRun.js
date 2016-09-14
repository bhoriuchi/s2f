export default {
  extendFields: ['Entity'],
  fields: {
    parameter: {
      type: 'Parameter',
      resolve: 'readParameter'
    },
    value: {
      type: 'FactoryJSON'
    }
  }
}