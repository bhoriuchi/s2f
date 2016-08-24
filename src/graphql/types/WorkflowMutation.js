export default {
  extendFields: {
    TemporalMutation: {
      branch: {
        name: 'branchWorkflow',
        type: 'Workflow',
        resolve: 'branchTemporalWorkflow'
      },
      fork: {
        name: 'forkWorkflow',
        type: 'Workflow',
        resolve: 'forkTemporalWorkflow'
      },
      publish: {
        name: 'publishWorkflow',
        type: 'Workflow',
        resolve: 'publishTemporalWorkflow'
      }
    }
  },
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