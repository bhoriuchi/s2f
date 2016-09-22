export default {
  extendFields: ['Entity'],
  fields: {
    workflowRun: {
      type: 'WorkflowRun',
      belongsTo: {
        WorkflowRun: { threads: 'id' }
      }
    },
    currentStepRun: {
      type: 'StepRun',
      has: 'id'
      // resolve: 'readStepRun'
    },
    stepRuns: {
      type: ['StepRun'] /* ,
      args: {
        id: { type: 'String' }
      },
      resolve: 'readStepRun'
      */
    },
    status: {
      type: 'RunStatusEnum'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run_thread'
  }
}