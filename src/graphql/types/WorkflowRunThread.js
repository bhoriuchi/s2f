export default {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    parentThread: {
      type: 'WorkflowRunThread',
      has: 'id',
      resolve: 'readWorkflowRunThread'
    },
    workflowRun: {
      type: 'WorkflowRun',
      belongsTo: {
        WorkflowRun: { threads: 'id' }
      },
      has: 'id'
    },
    currentStepRun: {
      type: 'StepRun',
      has: 'id',
      // resolve: 'readStepRun'
    },
    stepRuns: {
      type: ['StepRun'],
      resolve: 'readStepRun'
    },
    status: {
      type: 'RunStatusEnum'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run_thread',
    mutation: {
      create: {
        args: {
          workflowRun: { type: 'String', nullable: false },
          currentStepRun: { type: 'String', nullable: false }
        }
      },
      update: {
        args: {
          id: { type: 'String', nullable: false },
          currentStepRun: { type: 'String' },
          status: { type: 'RunStatusEnum' }
        }
      },
      delete: {
        args: {
          id: { type: 'String', nullable: false }
        }
      }
    }
  }
}