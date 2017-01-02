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
        Workflow: { steps: { foreignKey: 'id' } }
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
      has: '_temporal.recordId'
    },
    subWorkflow: {
      description: 'Nested workflow to run',
      type: 'Workflow',
      has: '_temporal.recordId'
    },
    versionArgs: {
      description: 'Lock a task or subworkflow into a specific version',
      type: 'FactoryJSON'
    },
    timeout: {
      description: 'Time in ms to allow the step to run before timing out',
      type: 'Int'
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
      type: ['Parameter']
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
    },
    ex: {
      description: 'Extension data, can be used by plugins for example ui positioning information',
      type: 'FactoryJSON'
    }
  },
  _temporal: {
    versioned: true,
    branch: false,
    fork: false,
    publish: false,
    create: false,
    update: false,
    delete: false
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'step',
    mutation: {
      create: false,
      update: false,
      delete: false
    }
  }
}