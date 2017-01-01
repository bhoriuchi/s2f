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
      type: 'Folder',
      has: 'id'
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
      type: ['Parameter']
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step']
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