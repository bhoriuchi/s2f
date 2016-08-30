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
    updateWorkflow: {
      type: 'Workflow',
      args: {
        name: { type: 'String' },
        description: { type: 'String' }
      },
      resolve: 'updateWorkflow'
    },
    deleteWorkflow: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteWorkflow'
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
    updateStep: {
      type: 'Step',
      args: {
        id: { type: 'String', nullable: false },
        name: { type: 'String' },
        source: { type: 'String' },
        task: { type: 'String' },
        subWorkflow: { type: 'String' },
        timeout: { type: 'Int' },
        failsWorkflow: { type: 'Boolean' },
        waitOnSuccess: { type: 'Boolean' },
        requireResumeKey: { type: 'Boolean' },
        success: { type: 'String' },
        fail: { type: 'String' }
      },
      resolve: 'updateStep'
    },
    deleteStep: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteStep'
    },
    createParameter: {
      type: 'Parameter',
      args: {
        name: { type: 'String', nullable: false },
        description: { type: 'String' },
        parentId: { type: 'String', nullable: false },
        scope: { type: 'ParameterScopeEnum', nullable: false },
        type: { type: 'ParameterTypeEnum', defaultValue: 'STRING' },
        required: { type: 'Boolean', defaultValue: 'false' },
        mapsTo: { type: 'String' },
        defaultValue: { type: 'String' }
      },
      resolve: 'createParameter'
    },
    updateParameter: {
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
      resolve: 'updateParameter'
    },
    deleteParameter: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteParameter'
    }
  }
}