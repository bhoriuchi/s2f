export default {
  extendFields: ['S2FEntity'],
  fields: {
    workflow: {
      type: 'Workflow',
      has: 'id'
      // resolve: 'readWorkflow'
    },
    args: {
      type: 'FactoryJSON'
    },
    input: {
      type: 'FactoryJSON'
    },
    context: {
      type: ['ParameterRun'] /* ,
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameterRun'
      */
    },
    threads: {
      type: ['WorkflowRunThread'] /* ,
      args: {
        id: { type: 'String' }
      },
      resolve: 'readWorkflowRunThread'
      */
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
    query: {
      read: {
        args: {
          id: { type: 'String' }
        }
      }
    },
    mutation: {
      create: {
        // type: 'WorkflowRun',
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
      }
    }
  }
}