export default {
  extendFields: ['TemporalType'],
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    name: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    inputs: {
      description: 'Inputs from steps',
      type: ['Parameter'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readWorkflowInputs'
    },
    parameters: {
      description: 'Global parameters',
      type: ['Parameter'] /* ,
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameter'
      */
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step'],
      args: {
        id: { type: 'String' },
        first: { type: 'Boolean' }
      },
      resolve: 'readStep'
    },
    endStep: {
      type: 'String'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow',
    temporal: true,
    query: {
      read: {
        type: ['Workflow'],
        args: {
          recordId: { type: 'String' },
          id: { type: 'String' },
          version: { type: 'String' },
          date: { type: 'FactoryDateTime' }
        },
        resolve: 'readWorkflow'
      }
    },
    mutation: {
      create: {
        type: 'Workflow',
        args: {
          name: { type: 'String', nullable: false },
          description: { type: 'String' }
        },
        resolve: 'createWorkflow'
      },
      update: {
        type: 'Workflow',
        args: {
          name: { type: 'String' },
          description: { type: 'String' }
        },
        resolve: 'updateWorkflow'
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteWorkflow'
      },
      branchWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'branchWorkflow'
      },
      forkWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'forkWorkflow'
      },
      publishWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'publishWorkflow'
      }
    }
  }
}