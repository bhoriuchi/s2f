export default {
  extendFields: ['Entity'],
  fields: {
    workflowRun: {
      type: 'WorkflowRun'
    },
    currentStepRun: {
      type: 'StepRun',
      resolve: 'readStepRun'
    },
    stepRuns: {
      type: ['StepRun'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readStepRun'
    },
    status: {
      type: 'RunStatusEnum'
    }
  }
}