export default {
  extendFields: ['Entity'],
  fields: {
    workflowRun: {
      type: 'String'
    },
    currentStep: {
      type: 'StepRun'
    },
    status: {
      type: 'StepRunStatusEnum'
    }
  }
}