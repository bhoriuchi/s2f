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
      resolve: 'readStepRun'
    },
    status: {
      type: 'RunStatusEnum'
    }
  }
}