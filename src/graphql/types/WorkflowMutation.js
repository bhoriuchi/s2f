export default {
  extendFields: {
    TemporalMutation: {
      branch: {
        name: 'branchWorkflow',
        type: 'Workflow',
        resolve: 'branchTemporalWorkflow'
      },
      fork: {
        name: 'forkWorkflow',
        type: 'Workflow',
        resolve: 'forkTemporalWorkflow'
      },
      publish: {
        name: 'publishWorkflow',
        type: 'Workflow',
        resolve: 'publishTemporalWorkflow'
      }
    }
  },
  fields: {
    createWorkflow: {
      type: 'Workflow',
      args: {
        name: {
          type: 'String',
          nullable: false
        },
        description: {
          type: 'String'
        }
      },
      resolve: 'createWorkflow'
    },
    createStep: {
      type: 'Step',
      args: {
        workflowId: {
          type: 'String',
          nullable: false
        },
        name: {
          type: 'String',
          nullable: false
        },
        type: {
          type: 'StepTypeEnum',
          nullable: false
        },
        source: 'String',
        task: 'String',
        subWorkflow: 'String',
        timeout: {
          type: 'Int',
          defaultValue: 0
        },
        failsWorkflow: {
          type: 'Boolean',
          defaultValue: false
        },
        waitOnSuccess: {
          type: 'Boolean',
          defaultValue: false
        },
        requireResumeKey: {
          type: 'Boolean',
          defaultValue: false
        },
        success: {
          type: 'String'
        },
        fail: {
          type: 'String'
        }
      },
      resolve: 'createStep'
    }
  }
}