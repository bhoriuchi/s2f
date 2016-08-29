export default {
  extendFields: {
    TemporalMutation: {
      branch: { name: 'branchWorkflow', type: 'Workflow', resolve: 'branchTemporalWorkflow' },
      fork: { name: 'forkWorkflow', type: 'Workflow', resolve: 'forkTemporalWorkflow' },
      publish: { name: 'publishWorkflow', type: 'Workflow', resolve: 'publishTemporalWorkflow' }
    }
  },
  fields: {
    createWorkflow: {
      type: 'Workflow',
      args: {
        name: { type: 'String', nullable: false },
        description: { type: 'String' }
      },
      resolve: 'createWorkflow'
    },
    createStep: {
      type: 'Step',
      args: {
        workflowId: { type: 'String', nullable: false },
        name: { type: 'String', nullable: false },
        type: { type: 'StepTypeEnum', nullable: false },
        source: { type: 'String' },
        task: { type: 'String' },
        subWorkflow: { type: 'String' },
        timeout: { type: 'Int', defaultValue: 0 },
        failsWorkflow: { type: 'Boolean', defaultValue: false },
        waitOnSuccess: { type: 'Boolean', defaultValue: false },
        requireResumeKey: { type: 'Boolean', defaultValue: false },
        success: { type: 'String' },
        fail: { type: 'String' }
      },
      resolve: 'createStep'
    },
    createGlobalParameter: {
      type: 'Parameter',
      args: {
        workflowId: { type: 'String', nullable: false },
        name: { type: 'String', nullable: false },
        description: { type: 'String' },
        type: { type: 'ParameterTypeEnum', defaultValue: 'STRING' },
        required: { type: 'Boolean', defaultValue: 'false' },
        defaultValue: { type: 'String' }
      },
      resolve: 'createGlobalParameter'
    },
    createInputParameter: {
      type: 'Parameter',
      args: {
        stepId: { type: 'String', nullable: false },
        name: { type: 'String', nullable: false },
        description: { type: 'String' },
        type: { type: 'ParameterTypeEnum', defaultValue: 'STRING' },
        required: { type: 'Boolean', defaultValue: 'false' },
        mapsTo: { type: 'String' },
        defaultValue: { type: 'String' }
      },
      resolve: 'createInputParameter'
    },
    createOutputParameter: {
      type: 'Parameter',
      args: {
        stepId: { type: 'String', nullable: false },
        name: { type: 'String', nullable: false },
        description: { type: 'String' },
        type: { type: 'ParameterTypeEnum', defaultValue: 'STRING' },
        required: { type: 'Boolean', defaultValue: 'false' },
        mapsTo: { type: 'String' },
        defaultValue: { type: 'String' }
      },
      resolve: 'createOutputParameter'
    },
    updateGlobalParameter: {
      type: 'Parameter',
      args: {
        id: { type: 'String', nullable: false },
        name: { type: 'String' },
        description: { type: 'String' },
        type: { type: 'ParameterTypeEnum' },
        required: { type: 'Boolean' },
        defaultValue: { type: 'String' }
      },
      resolve: 'updateGlobalParameter'
    },
    updateLocalParameter: {
      type: 'Parameter',
      args: {
        id: { type: 'String', nullable: false },
        name: { type: 'String' },
        description: { type: 'String' },
        type: { type: 'ParameterTypeEnum' },
        required: { type: 'Boolean' },
        mapsTo: { type: 'String' },
        defaultValue: { type: 'String' }
      },
      resolve: 'updateLocalParameter'
    },
    deleteGlobalParameter: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false },
        workflowId: { type: 'String', nullable: false }
      },
      resolve: 'deleteGlobalParameter'
    },
    deleteLocalParameter: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false },
        stepId: { type: 'String', nullable: false }
      },
      resolve: 'deleteLocalParameter'
    }
  }
}