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
    folder: {
      type: 'String',
      resolve: 'readWorkflowFolder'
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
      type: ['Parameter'],
      has: 'parentId'
      /*
      args: {
        id: { type: 'String' }
      },
      resolve: 'backend_readParameter'
      */
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step'],
      has: 'workflowId'
      /*
      args: {
        id: { type: 'String' },
        first: { type: 'Boolean' }
      },
      resolve: 'readStep'
      */
    },
    endStep: {
      type: 'Step',
      resolve: 'readEndStep'
    }
  },
  _temporal: {
    versioned: true,
    create: false,
    update: false,
    delete: false,
    branch: 'branchWorkflow',
    fork: 'forkWorkflow',
    publish: 'publishWorkflow',
    readMostCurrent: true
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow',
    query: {
      /*
      read: {
        type: ['Workflow'],
        args: {
          recordId: { type: 'String' },
          id: { type: 'String' },
          version: { type: 'String' },
          date: { type: 'FactoryDateTime' }
        },
        resolve: 'readWorkflow'
      },
      */
      readWorkflowVersions: {
        type: ['Workflow'],
        args: {
          recordId: { type: 'String', nullable: false },
          limit: { type: 'Int' },
          offset: { type: 'Int' }
        },
        resolve: 'readWorkflowVersions'
      }
    },
    mutation: {
      /*
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
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'branchWorkflow'
      },
      forkWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'forkWorkflow'
      },
      publishWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false },
          version: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'publishWorkflow'
      },
      */
      syncWorkflow: {
        type: 'Workflow',
        args: {
          owner: { type: 'String' },
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          description: { type: 'String' },
          folder: { type: 'String' },
          parameters: ['SyncParameterInput'],
          steps: ['SyncStepInput']
        },
        resolve: 'syncWorkflow'
      }
    }
  }
}