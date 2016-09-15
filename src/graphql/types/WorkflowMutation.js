export default {
  extendFields: {
    TemporalMutation: {
      branch: { name: 'branchTask', type: 'Task', resolve: 'branchTemporalTask' },
      fork: { name: 'forkTask', type: 'Task', resolve: 'forkTemporalTask' },
      publish: { name: 'publishTask', type: 'Task', resolve: 'publishTemporalTask' }
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
    branchWorkflow: {
      type: 'Workflow',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'branchWorkflow'
    },
    forkWorkflow: {
      type: 'Workflow',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'forkWorkflow'
    },
    publishWorkflow: {
      type: 'Workflow',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'publishWorkflow'
    },
    createStep: {
      type: 'Step',
      args: {
        workflowId: { type: 'String', nullable: false },
        name: { type: 'String', nullable: false },
        type: { type: 'StepTypeEnum', nullable: false },
        async: { type: 'Boolean', defaultValue: false },
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
        async: { type: 'Boolean' },
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
        class: { type: 'ParameterClassEnum', nullable: false },
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
    },
    createTask: {
      type: 'Task',
      args: {
        name: { type: 'String', nullable: false },
        description: { type: 'String' },
        source: { type: 'String', nullable: false }
      },
      resolve: 'createTask'
    },
    updateTask: {
      type: 'Task',
      args: {
        id: { type: 'String', nullable: false },
        name: { type: 'String' },
        description: { type: 'String' },
        source: { type: 'String' }
      },
      resolve: 'updateTask'
    },
    deleteTask: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteTask'
    },
    createWorkflowRun: {
      type: 'WorkflowRun',
      args: {
        workflow: { type: 'String' },
        args: { type: 'FactoryJSON' },
        input: { type: 'FactoryJSON' },
        parameters: { type: ['ParameterInput'] },
        step: { type: 'StepInput' }
      },
      resolve: 'createWorkflowRun'
    },
    updateWorkflowRun: {
      type: 'WorkflowRun',
      args: {
        id: { type: 'String', nullable: false },
        status: { type: 'RunStatusEnum' },
        ended: { type: 'FactoryDateTime' }
      },
      resolve: 'updateWorkflowRun'
    },
    deleteWorkflowRun: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteWorkflowRun'
    },
    createWorkflowRunThread: {
      type: 'WorkflowRunThread',
      args: {
        workflowRun: { type: 'String', nullable: false },
        currentStepRun: { type: 'String', nullable: false }
      },
      resolve: 'createWorkflowRunThread'
    },
    updateWorkflowRunThread: {
      type: 'WorkflowRunThread',
      args: {
        id: { type: 'String', nullable: false },
        currentStepRun: { type: 'String' },
        status: { type: 'RunStatusEnum' }
      },
      resolve: 'updateWorkflowRunThread'
    },
    deleteWorkflowRunThread: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteWorkflowRunThread'
    },
    createStepRun: {
      type: 'StepRun',
      args: {
        step: { type: 'String', nullable: false },
        workflowRunThread: { type: 'String', nullable: false }
      },
      resolve: 'createStepRun'
    },
    updateStepRun: {
      type: 'StepRun',
      args: {
        id: { type: 'String', nullable: false },
        status: { type: 'RunStatusEnum'},
        ended: { type: 'FactoryDateTime' }
      },
      resolve: 'updateStepRun'
    },
    deleteStepRun: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteStepRun'
    },
    startStepRun: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'startStepRun'
    },
    endStepRun: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false },
        success: { type: 'Boolean', defaultValue: true }
      },
      resolve: 'endStepRun'
    },
    createParameterRun: {
      type: 'ParameterRun',
      args: {
        parameter: { type: 'String', nullable: false },
        parentId: { type: 'String', nullable: false },
        value: { type: 'FactoryJSON' }
      },
      resolve: 'createParameterRun'
    },
    updateParameterRun: {
      type: 'ParameterRun',
      args: {
        id: { type: 'String', nullable: false },
        value: { type: 'FactoryJSON' }
      },
      resolve: 'updateParameterRun'
    },
    deleteParameterRun: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteParameterRun'
    }
  }
}