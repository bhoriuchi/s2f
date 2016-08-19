export default {
  extendFields: ['Entity', 'Named', 'Described'],
  fields: {
    type: {
      description: 'Step type (condition, loop, fork, join, workflow, task, etc...)',
      type: 'StepTypeEnum',
      nullable: false
    },
    source: {
      description: 'Source code to run. Can be null if a task or subworkflow is being used',
      type: 'String'
    },
    task: {
      description: 'Published task to use as source for execution code',
      type: 'String'
    },
    subWorkflow: {
      description: 'Nested workflow to run',
      type: 'String'
    },
    timeout: {
      description: 'Time in ms to allow the step to run before timing out',
      type: 'Number',
      nullable: false
    },
    failsWorkflow: {
      description: 'If true and this step fails, the workflow will be considered failed',
      type: 'Boolean',
      nullable: false
    },
    waitOnSuccess: {
      description: 'On successful step completion wait for external input to resume',
      type: 'Boolean',
      nullable: false
    },
    requireResumeKey: {
      description: 'Used with waitOnSuccess. The StepRun key is required to initiate a workflow resume',
      type: 'Boolean',
      nullable: false
    },
    workflow: {
      description: 'The workflow this step is a member of',
      type: 'String',
      nullable: false
    },
    success: {
      description: 'Step to execute on success',
      type: 'String',
      nullable: false
    },
    fail: {
      description: 'Step to execute on failure',
      type: 'String',
      nullable: false
    },
    inputs: {
      description: 'Input parameters associated with the step',
      type: ['Parameter']
    },
    outputs: {
      description: 'Output parameters associated with the step',
      type: ['Parameter']
    }
  }
}