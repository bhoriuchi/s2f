export default {
  fields: {
    readWorkflow: {
      type: ['Workflow'],
      args: {
        id: {
          type: 'String'
        },
        recordId: {
          type: 'String'
        },
        version: {
          type: 'String'
        },
        date: {
          type: 'TemporalDateTime'
        }
      },
      resolve: 'readWorkflow'
    }
  }
}