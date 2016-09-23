export default {
  extendFields: ['TemporalType', 'S2FEntity', 'S2FNamed', 'S2FDescribed'],
  fields: {
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
        args: {
          id: { type: 'String' }
        }
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