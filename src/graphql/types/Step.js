export default {
  extendFields: ['TemporalType'],
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    name: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    workflowId: {
      description: 'Workflow the step belongs to',
      type: 'String',
      nullable: false,
      belongsTo: {
        Workflow: { steps: 'id' }
      }
    },
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
      type: 'String',
      resolve: 'readSource'
    },
    task: {
      description: 'Published task to use as source for execution code',
      type: 'Task',
      has: 'id',
      resolve: 'readTask'
    },
    subWorkflow: {
      description: 'Nested workflow to run',
      type: 'String'
    },
    versionArgs: {
      description: 'Lock a task or subworkflow into a specific version',
      type: 'FactoryJSON'
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
      type: 'String'
    },
    fail: {
      description: 'Step to execute on failure, defaults to end',
      type: 'String'
    },
    parameters: {
      description: 'Local parameters associated with the step',
      type: ['Parameter'],
      resolve: 'readParameter'
    },
    fork: {
      type: 'String',
      belongsTo: {
        Step: { threads: 'id' }
      }
    },
    threads: {
      description: 'Keeps track of the forked threads for a fork or the threads that will join if a join',
      type: ['Step'],
      resolve: 'readStepThreads'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'step',
    temporal: true,
    query: {
      read: {
        resolve: 'readStep'
      }
    },
    mutation: {
      create: {
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
      update: {
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
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteStep'
      }
    }
  }
}