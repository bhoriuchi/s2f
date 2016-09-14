export default {
  type: 'Input',
  extendFields: ['Entity', 'Named', 'Described'],
  fields: {
    type: {
      description: 'Step type (condition, loop, fork, join, workflow, task, etc...)',
      type: 'StepTypeEnum',
      nullable: false
    },
    async: {
      description: 'Step runs asynchronously',
      type: 'Boolean'
    },
    source: {
      description: 'Source code to run. Can be null if a task or subworkflow is being used',
      type: 'String'
    },
    subWorkflow: {
      description: 'Nested workflow to run',
      type: 'String'
    },
    timeout: {
      description: 'Time in ms to allow the step to run before timing out',
      type: 'Int',
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
    success: {
      description: 'Step to execute on success',
      type: 'String',
      nullable: false
    },
    fail: {
      description: 'Step to execute on failure, defaults to end',
      type: 'String'
    },
    parameters: {
      type: ['ParameterInput']
    }
  }
}