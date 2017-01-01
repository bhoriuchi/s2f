export default {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    workflowRunThread: {
      type: 'String',
      belongsTo: {
        WorkflowRunThread: { stepRuns: 'id' }
      }
    },
    thread: {
      type: 'WorkflowRunThread',
      has: 'id' // resolve: 'readWorkflowRunThread'
    },
    context: {
      type: ['ParameterRun']
    },
    step: {
      description: 'The step associated with this run',
      type: 'Step',
      has: 'id'
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
    taskId: {
      type: 'String'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'step_run',
    mutation: {
      /*
      create: {
        type: 'StepRun',
        args: {
          step: { type: 'String', nullable: false },
          workflowRunThread: { type: 'String', nullable: false },
          taskId: { type: 'String' }
        },
        resolve: 'createStepRun'
      },
      update: {
        type: 'StepRun',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum'},
          taskId: { type: 'String' },
          ended: { type: 'FactoryDateTime' }
        }
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        }
      },
      */
      create: false,
      update: false,
      delete: false,
      startStepRun: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false },
          taskId: { type: 'String' }
        },
        resolve: 'startStepRun'
      },
      setStepRunStatus: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum', nullable: false }
        },
        resolve: 'setStepRunStatus'
      },
      createForks: {
        type: ['WorkflowRunThread'],
        args: {
          step: { type: 'String', nullable: false },
          workflowRun: { type: 'String', nullable: false },
          workflowRunThread: { type: 'String', nullable: false }
        },
        resolve: 'createForks'
      },
      getJoinThreads: {
        type: ['WorkflowRunThread'],
        args: {
          step: { type: 'String', nullable: false },
          workflowRun: { type: 'String', nullable: false }
        },
        resolve: 'getJoinThreads'
      }
    }
  }
}