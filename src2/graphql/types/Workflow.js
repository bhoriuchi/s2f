export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
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
      type: ['Step'] /* ,
      args: {
        id: { type: 'String' },
        first: { type: 'Boolean' }
      },
      resolve: 'readStep'
      */
    },
    endStep: {
      type: 'String'
    },
    _backend: {
      schema: 'S2FWorkflow',
      collection: 'workflow',
      mutation: {
        create: {
          resolve: 'createWorkflow'
        },
        update: {
          resolve: 'updateWorkflow'
        },
        delete: {
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
}