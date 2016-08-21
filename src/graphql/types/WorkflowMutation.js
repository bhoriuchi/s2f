export default {
  fields: {
    createWorkflow: {
      type: 'Workflow',
      args: {
        name: {
          type: 'String',
          nullable: false
        },
        description: {
          type: 'String'
        }
      },
      resolve: 'createWorkflow'
    }
  }
}