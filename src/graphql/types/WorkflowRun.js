export default {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    workflow: {
      type: 'Workflow',
      has: 'id',
      resolve: 'readWorkflow'
    },
    args: {
      type: 'FactoryJSON'
    },
    input: {
      type: 'FactoryJSON'
    },
    context: {
      type: ['ParameterRun'],
      resolve: 'readParameterRun'
    },
    threads: {
      type: ['WorkflowRunThread'],
      resolve: 'readWorkflowRunThread'
    },
    started: {
      type: 'FactoryDateTime'
    },
    ended: {
      type: 'FactoryDateTime'
    },
    status: {
      type: 'RunStatusEnum'
    },
    parentStepRun: {
      type: 'String'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run',
    mutation: {
      create: {
        args: {
          workflow: { type: 'String' },
          args: { type: 'FactoryJSON' },
          input: { type: 'FactoryJSON' },
          parameters: { type: ['ParameterInput'] },
          step: { type: 'StepInput' }
        },
        resolve: 'createWorkflowRun'
      },
      update: {
        type: 'WorkflowRun',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum' },
          ended: { type: 'FactoryDateTime' }
        },
        resolve: 'updateWorkflowRun'
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteWorkflowRun'
      },
      endWorkflowRun: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum', nullable: false }
        },
        resolve: 'endWorkflowRun'
      }
    }
  }
}