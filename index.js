'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var chalk = _interopDefault(require('chalk'));
var yellowjacket = require('yellowjacket');
var FactoryTemporalPlugin = _interopDefault(require('graphql-factory-temporal'));
var graphqlFactoryTemporal_backend = require('graphql-factory-temporal/backend');
var graphql_error = require('graphql/error');
var obj2arg = _interopDefault(require('graphql-obj2arg'));
var sbx = _interopDefault(require('sbx'));

var S2FDescribed = {
  description: {
    type: 'String'
  }
};

var S2FEntity = {
  id: {
    type: 'String',
    primary: true
  },
  entityType: {
    type: 'EntityTypeEnum'
  }
};

var S2FNamed = {
  name: {
    type: 'String'
  }
};

var fields = {
  S2FDescribed: S2FDescribed,
  S2FEntity: S2FEntity,
  S2FNamed: S2FNamed
};

var EntitySummary = {
  fields: {
    id: 'String',
    branchId: 'String',
    version: 'String',
    name: 'String',
    description: 'String'
  }
};

var EntityTypeEnum = {
  type: 'Enum',
  values: {
    PARAMETER: 'PARAMETER',
    PARAMETERRUN: 'PARAMETERRUN',
    STEP: 'STEP',
    STEPRUN: 'STEPRUN',
    TASK: 'TASK',
    WORKFLOW: 'WORKFLOW',
    WORKFLOWRUN: 'WORKFLOWRUN',
    RUNQUEUE: 'RUNQUEUE',
    FOLDER: 'FOLDER'
  }
};

var Folder = {
  fields: {
    id: { type: 'String', primary: true },
    entityType: { type: 'EntityTypeEnum' },
    name: { type: 'String', nullable: false },
    parent: { type: 'String', nullable: false },
    type: { type: 'FolderChildTypeEnum', nullable: false }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'folder',
    query: {
      readRootFolder: {
        type: 'FolderView',
        args: {
          type: { type: 'FolderChildTypeEnum', nullable: false }
        },
        resolve: 'readRootFolder'
      },
      readSubFolder: {
        type: 'FolderView',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'readSubFolder'
      }
    }
  }
};

var FolderChildTypeEnum = {
  type: 'Enum',
  values: {
    ROOT: 'ROOT',
    WORKFLOW: 'WORKFLOW',
    TASK: 'TASK'
  }
};

var FolderMembership = {
  fields: {
    childId: { type: 'String', primary: true },
    folder: { type: 'String' },
    childType: { type: 'FolderChildTypeEnum' }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'folder_membership'
  }
};

var FolderView = {
  fields: {
    id: 'String',
    name: 'String',
    parent: 'String',
    type: 'FolderChildTypeEnum',
    subFolders: ['Folder'],
    entities: ['EntitySummary']
  }
};

var Parameter = {
  type: ['Object', 'Input'],
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
    type: {
      description: 'The data type of the parameter',
      type: 'ParameterTypeEnum',
      nullable: false
    },
    scope: {
      description: 'The scope of the parameter',
      type: 'ParameterScopeEnum',
      nullable: false,
      omitFrom: 'Input'
    },
    class: {
      description: 'Class of parameter',
      type: 'ParameterClassEnum'
    },
    required: {
      description: 'Parameter is required',
      type: 'Boolean',
      nullable: false
    },
    mapsTo: {
      description: 'Name of global context parameter to map',
      type: 'String'
    },
    defaultValue: {
      description: 'Default value',
      type: 'String'
    },
    parentId: {
      description: 'Object the parameter belongs to',
      type: 'String',
      belongsTo: {
        Workflow: { parameters: 'id' },
        Step: { parameters: 'id' },
        Task: { parameters: 'id' }
      }
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'parameter',
    mutation: {
      create: {
        resolve: 'createParameter'
      },
      update: {
        resolve: 'updateParameter'
      },
      delete: {
        resolve: 'deleteParameter'
      }
    }
  }
};

var ParameterClassEnum = {
  type: 'Enum',
  values: {
    ATTRIBUTE: 'ATTRIBUTE',
    INPUT: 'INPUT',
    OUTPUT: 'OUTPUT'
  }
};

var ParameterRun = {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    parameter: {
      type: 'Parameter',
      has: 'id'
    },
    parentId: {
      type: 'String',
      belongsTo: {
        WorkflowRun: { context: 'id' },
        StepRun: { context: 'id' }
      }
    },
    value: {
      type: 'FactoryJSON'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'parameter_run',
    mutation: {
      create: {
        type: 'ParameterRun',
        args: {
          parameter: { type: 'String', nullable: false },
          parentId: { type: 'String', nullable: false },
          value: { type: 'FactoryJSON' }
        },
        resolve: 'createParameterRun'
      },
      update: {
        type: 'ParameterRun',
        args: {
          id: { type: 'String', nullable: false },
          value: { type: 'FactoryJSON' }
        },
        resolve: 'updateParameterRun'
      },
      delete: {
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteParameterRun'
      },
      updateAttributeValues: {
        type: 'Boolean',
        args: {
          values: { type: ['ParameterRunValueInput'], nullable: false }
        },
        resolve: 'updateAttributeValues'
      }
    }
  }
};

var ParameterRunValueInput = {
  type: 'Input',
  fields: {
    id: { type: 'String' },
    value: { type: 'FactoryJSON' }
  }
};

var ParameterTypeEnum = {
  type: 'Enum',
  values: {
    ARRAY: 'ARRAY',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    NUMBER: 'NUMBER',
    OBJECT: 'OBJECT',
    STRING: 'STRING',
    PASSWORD: 'PASSWORD'
  }
};

var ParameterScopeEnum = {
  type: 'Enum',
  values: {
    WORKFLOW: 'WORKFLOW',
    STEP: 'STEP',
    TASK: 'TASK'
  }
};

var RunStatusEnum = {
  type: 'Enum',
  values: {
    CREATED: 'CREATED',
    RUNNING: 'RUNNING',
    WAITING: 'WAITING',
    JOINING: 'JOINING',
    FORKING: 'FORKING',
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL',
    FORKED: 'FORKED',
    JOINED: 'JOINED',
    ENDING: 'ENDING',
    ENDED: 'ENDED'
  }
};

var Step = {
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
      type: 'Workflow',
      has: 'id',
      resolve: 'readWorkflow'
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
    },
    ex: {
      description: 'Extension data, can be used by plugins for example ui positioning information',
      type: 'FactoryJSON'
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
};

var StepInput = {
  type: 'Input',
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
      type: 'String'
    },
    fail: {
      description: 'Step to execute on failure, defaults to end',
      type: 'String'
    },
    parameters: {
      type: ['ParameterInput']
    }
  }
};

var StepRun = {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    workflowRunThread: {
      type: 'String',
      belongsTo: {
        WorkflowRunThread: { stepRuns: 'id' }
      }
    },
    context: {
      type: ['ParameterRun']
    },
    step: {
      description: 'The step associated with this run',
      type: 'Step',
      has: 'id'
    },
    started: {
      type: 'FactoryDateTime'
    },
    ended: {
      type: 'FactoryDateTime'
    },
    status: {
      type: 'RunStatusEnum'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'step_run',
    mutation: {
      create: {
        type: 'StepRun',
        args: {
          step: { type: 'String', nullable: false },
          workflowRunThread: { type: 'String', nullable: false }
        },
        resolve: 'createStepRun'
      },
      update: {
        type: 'StepRun',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum' },
          ended: { type: 'FactoryDateTime' }
        },
        resolve: 'updateStepRun'
      },
      delete: {
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
          status: { type: 'RunStatusEnum', nullable: false }
        },
        resolve: 'endStepRun'
      },
      createForks: {
        type: ['WorkflowRunThread'],
        args: {
          step: { type: 'String', nullable: false },
          workflowRun: { type: 'String', nullable: false },
          workflowRunThread: { type: 'String', nullable: false }
        },
        resolve: 'createForks'
      },
      getJoinThreads: {
        type: ['WorkflowRunThread'],
        args: {
          step: { type: 'String', nullable: false },
          workflowRun: { type: 'String', nullable: false }
        },
        resolve: 'getJoinThreads'
      }
    }
  }
};

var StepTypeEnum = {
  type: 'Enum',
  values: {
    BASIC: 'BASIC',
    CONDITION: 'CONDITION',
    END: 'END',
    FORK: 'FORK',
    JOIN: 'JOIN',
    LOOP: 'LOOP',
    START: 'START',
    TASK: 'TASK',
    WORKFLOW: 'WORKFLOW'
  }
};

var SyncIdInput = {
  type: 'Input',
  fields: {
    id: { type: 'String', nullable: false }
  }
};

var SyncParameterInput = {
  type: 'Input',
  fields: {
    id: { type: 'String', nullable: false },
    name: { type: 'String', nullable: false },
    description: { type: 'String' },
    type: { type: 'ParameterTypeEnum', nullable: false },
    scope: { type: 'ParameterScopeEnum', nullable: false },
    class: { type: 'ParameterClassEnum', nullable: false },
    required: { type: 'Boolean' },
    mapsTo: { type: 'String' },
    defaultValue: { type: 'String' }
  }
};

var SyncStepInput = {
  type: 'Input',
  fields: {
    id: { type: 'String', nullable: false },
    name: { type: 'String', nullable: false },
    description: { type: 'String' },
    type: { type: 'StepTypeEnum', nullable: false },
    async: 'Boolean',
    source: 'String',
    versionArgs: 'FactoryJSON',
    timeout: 'Int',
    failsWorkflow: 'Boolean',
    waitOnSuccess: 'Boolean',
    requireResumeKey: 'Boolean',
    parameters: ['SyncParameterInput'],
    task: 'SyncTemporalInput',
    subWorkflow: 'SyncTemporalInput',
    success: 'String',
    fail: 'String',
    ex: 'FactoryJSON',
    threads: ['SyncIdInput']
  }
};

var SyncTemporalInput = {
  type: 'Input',
  fields: {
    _temporal: { type: 'SyncTemporalMetadataInput' },
    id: { type: 'String' }
  }
};

var SyncTemporalMetadataInput = {
  type: 'Input',
  fields: {
    recordId: { type: 'String' }
  }
};

var Task = {
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
    source: {
      type: 'String',
      nullable: false
    },
    parameters: {
      type: ['Parameter'],
      resolve: 'readParameter'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'task',
    temporal: true,
    query: {
      read: {
        type: ['Task'],
        args: {
          recordId: { type: 'String' },
          id: { type: 'String' },
          version: { type: 'String' },
          date: { type: 'FactoryDateTime' }
        },
        resolve: 'readTask'
      },
      readTaskVersions: {
        type: ['Task'],
        args: {
          recordId: { type: 'String', nullable: false },
          limit: { type: 'Int' },
          offset: { type: 'Int' }
        },
        resolve: 'readTaskVersions'
      }
    },
    mutation: {
      create: {
        type: 'Task',
        args: {
          name: { type: 'String', nullable: false },
          description: { type: 'String' },
          source: { type: 'String', nullable: false }
        },
        resolve: 'createTask'
      },
      update: {
        type: 'Task',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String' },
          description: { type: 'String' },
          source: { type: 'String' }
        },
        resolve: 'updateTask'
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteTask'
      },
      branchTask: {
        type: 'Task',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'branchTemporalTask'
      },
      forkTask: {
        type: 'Task',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'forkTemporalTask'
      },
      publishTask: {
        type: 'Task',
        args: {
          id: { type: 'String', nullable: false },
          version: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'publishTemporalTask'
      },
      syncTask: {
        type: 'Task',
        args: {
          owner: { type: 'String' },
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          description: { type: 'String' },
          source: { type: 'String', nullable: false },
          folder: { type: 'String' },
          parameters: ['SyncParameterInput']
        },
        resolve: 'syncTask'
      }
    }
  }
};

var Workflow = {
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
    folder: {
      type: 'String',
      resolve: 'readWorkflowFolder'
    },
    inputs: {
      description: 'Inputs from steps',
      type: ['Parameter'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readWorkflowInputs'
    },
    parameters: {
      description: 'Global parameters',
      type: ['Parameter'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readParameter'
    },
    steps: {
      description: 'Steps in the workflow',
      type: ['Step'],
      args: {
        id: { type: 'String' },
        first: { type: 'Boolean' }
      },
      resolve: 'readStep'
    },
    endStep: {
      type: 'Step',
      resolve: 'readEndStep'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow',
    temporal: true,
    query: {
      read: {
        type: ['Workflow'],
        args: {
          recordId: { type: 'String' },
          id: { type: 'String' },
          version: { type: 'String' },
          date: { type: 'FactoryDateTime' }
        },
        resolve: 'readWorkflow'
      },
      readWorkflowVersions: {
        type: ['Workflow'],
        args: {
          recordId: { type: 'String', nullable: false },
          limit: { type: 'Int' },
          offset: { type: 'Int' }
        },
        resolve: 'readWorkflowVersions'
      }
    },
    mutation: {
      create: {
        type: 'Workflow',
        args: {
          name: { type: 'String', nullable: false },
          description: { type: 'String' }
        },
        resolve: 'createWorkflow'
      },
      update: {
        type: 'Workflow',
        args: {
          name: { type: 'String' },
          description: { type: 'String' }
        },
        resolve: 'updateWorkflow'
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteWorkflow'
      },
      branchWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'branchWorkflow'
      },
      forkWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          owner: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'forkWorkflow'
      },
      publishWorkflow: {
        type: 'Workflow',
        args: {
          id: { type: 'String', nullable: false },
          version: { type: 'String' },
          changeLog: { type: 'TemporalChangeLogInput' }
        },
        resolve: 'publishWorkflow'
      },
      syncWorkflow: {
        type: 'Workflow',
        args: {
          owner: { type: 'String' },
          id: { type: 'String', nullable: false },
          name: { type: 'String', nullable: false },
          description: { type: 'String' },
          folder: { type: 'String' },
          parameters: ['SyncParameterInput'],
          steps: ['SyncStepInput']
        },
        resolve: 'syncWorkflow'
      }
    }
  }
};

var WorkflowRun = {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    workflow: {
      type: 'Workflow',
      has: 'id',
      resolve: 'readWorkflow'
    },
    args: {
      type: 'FactoryJSON'
    },
    input: {
      type: 'FactoryJSON'
    },
    context: {
      type: ['ParameterRun'],
      resolve: 'readParameterRun'
    },
    threads: {
      type: ['WorkflowRunThread'],
      resolve: 'readWorkflowRunThread'
    },
    started: {
      type: 'FactoryDateTime'
    },
    ended: {
      type: 'FactoryDateTime'
    },
    status: {
      type: 'RunStatusEnum'
    },
    parentStepRun: {
      type: 'String'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run',
    mutation: {
      create: {
        args: {
          workflow: { type: 'String' },
          args: { type: 'FactoryJSON' },
          input: { type: 'FactoryJSON' },
          parameters: { type: ['ParameterInput'] },
          step: { type: 'StepInput' },
          parent: { type: 'String' }
        },
        resolve: 'createWorkflowRun'
      },
      update: {
        type: 'WorkflowRun',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum' },
          ended: { type: 'FactoryDateTime' }
        },
        resolve: 'updateWorkflowRun'
      },
      delete: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false }
        },
        resolve: 'deleteWorkflowRun'
      },
      endWorkflowRun: {
        type: 'Boolean',
        args: {
          id: { type: 'String', nullable: false },
          status: { type: 'RunStatusEnum', nullable: false }
        },
        resolve: 'endWorkflowRun'
      }
    }
  }
};

var WorkflowRunThread = {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    parentThread: {
      type: 'WorkflowRunThread',
      has: 'id',
      resolve: 'readWorkflowRunThread'
    },
    workflowRun: {
      type: 'WorkflowRun',
      belongsTo: {
        WorkflowRun: { threads: 'id' }
      }
    },
    currentStepRun: {
      type: 'StepRun',
      has: 'id',
      resolve: 'readStepRun'
    },
    stepRuns: {
      type: ['StepRun'],
      resolve: 'readStepRun'
    },
    status: {
      type: 'RunStatusEnum'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run_thread',
    mutation: {
      create: {
        args: {
          workflowRun: { type: 'String', nullable: false },
          currentStepRun: { type: 'String', nullable: false }
        }
      },
      update: {
        args: {
          id: { type: 'String', nullable: false },
          currentStepRun: { type: 'String' },
          status: { type: 'RunStatusEnum' }
        }
      },
      delete: {
        args: {
          id: { type: 'String', nullable: false }
        }
      }
    }
  }
};

var types = {
  EntitySummary: EntitySummary,
  EntityTypeEnum: EntityTypeEnum,
  Folder: Folder,
  FolderChildTypeEnum: FolderChildTypeEnum,
  FolderMembership: FolderMembership,
  FolderView: FolderView,
  Parameter: Parameter,
  ParameterClassEnum: ParameterClassEnum,
  ParameterRun: ParameterRun,
  ParameterRunValueInput: ParameterRunValueInput,
  ParameterTypeEnum: ParameterTypeEnum,
  ParameterScopeEnum: ParameterScopeEnum,
  RunStatusEnum: RunStatusEnum,
  Step: Step,
  StepInput: StepInput,
  StepRun: StepRun,
  StepTypeEnum: StepTypeEnum,
  SyncIdInput: SyncIdInput,
  SyncParameterInput: SyncParameterInput,
  SyncStepInput: SyncStepInput,
  SyncTemporalInput: SyncTemporalInput,
  SyncTemporalMetadataInput: SyncTemporalMetadataInput,
  Task: Task,
  Workflow: Workflow,
  WorkflowRun: WorkflowRun,
  WorkflowRunThread: WorkflowRunThread
};

// import functions from './functions/index'
// import queries from './queries/index'

function mergeConfig() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  // merge passed config with required config
  return _.merge({}, config, { types: types, fields: fields });
}

function temporalTables(allTypes) {
  return _.omitBy(_.mapValues(allTypes, function (type) {
    var be = _.get(type, '_backend', {});
    return be.temporal ? { table: _.get(type, '_backend.collection') } : null;
  }), function (v) {
    return v === null;
  });
}

var workflow = {
  handler: function handler(_ref) {
    var payload = _ref.payload;
    var socket = _ref.socket;
    var requestId = _ref.requestId;
    var query = payload.query;
    var rootValue = payload.rootValue;
    var contextValue = payload.contextValue;
    var variableValues = payload.variableValues;
    var operationName = payload.operationName;

    return this.backend.lib.S2FWorkflow(query, rootValue, contextValue, variableValues, operationName).then(function (result) {
      if (socket) socket.emit("result." + requestId, result);
    }).catch(function (error) {
      if (socket) socket.emit("result." + requestId, { errors: [error] });
    });
  }
};

var local = {
  workflow: workflow
};

var workflow$1 = {
  handler: function handler(socketPayload) {
    this._emitter.emit('workflow', socketPayload);
  }
};

var socket = {
  workflow: workflow$1
};

var events = {
  local: local,
  socket: socket
};

function createFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
  };
}

function readFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
  };
}

function updateFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
  };
}

function deleteFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
  };
}

function readWorkflowFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
    var membership = backend.getTypeCollection('FolderMembership');
    return membership.get(source._temporal.recordId).do(function (m) {
      return m.eq(null).branch(folder.filter({ type: 'WORKFLOW', parent: 'ROOT' }).nth(0)('id'), m('folder'));
    }).run(connection);
  };
}

function readRootFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
    var member = backend.getTypeCollection('FolderMembership');
    var task = backend.getTypeCollection('Task');
    var workflow = backend.getTypeCollection('Workflow');

    return folder.filter(function (f) {
      return f('type').eq(args.type).and(f('parent').eq('ROOT'));
    }).merge(function (p) {
      return {
        subFolders: folder.filter({ parent: p('id') }).coerceTo('array'),
        entities: member.filter({ folder: p('id') }).map(function (m) {
          return r.expr(_.toLower(args.type)).eq('task').branch(task, workflow).filter({ _temporal: { recordId: m('childId') } }).coerceTo('array').do(function (e) {
            return e.count().eq(0).branch(null, e.nth(0).do(function (i) {
              return {
                id: i('_temporal')('recordId'),
                branchId: i('id'),
                version: i('_temporal')('version'),
                name: i('name')
              };
            }));
          });
        }).filter(function (r) {
          return r.eq(null).not();
        }).coerceTo('array')
      };
    }).coerceTo('array').do(function (res) {
      return res.count().eq(0).branch(null, res.nth(0));
    }).run(connection);
  };
}

function readSubFolder(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var folder = backend.getTypeCollection('Folder');
    var member = backend.getTypeCollection('FolderMembership');
    var task = backend.getTypeCollection('Task');
    var workflow = backend.getTypeCollection('Workflow');

    return folder.filter({ id: args.id }).merge(function (p) {
      return {
        subFolders: folder.filter({ parent: p('id') }).coerceTo('array'),
        entities: member.filter({ folder: p('id') }).map(function (m) {
          return p('type').eq('TASK').branch(task, workflow).filter({ _temporal: { recordId: m('childId') } }).coerceTo('array').do(function (e) {
            return e.count().eq(0).branch(null, e.nth(0).do(function (i) {
              return {
                id: i('_temporal')('recordId'),
                branchId: i('id'),
                version: i('_temporal')('version'),
                name: i('name')
              };
            }));
          });
        }).filter(function (r) {
          return r.eq(null).not();
        }).coerceTo('array')
      };
    }).coerceTo('array').do(function (res) {
      return res.count().eq(0).branch(null, res.nth(0));
    }).run(connection);
  };
}

function createParameter(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Parameter');

    if (args.scope === 'WORKFLOW' && args.class !== 'ATTRIBUTE') {
      throw new Error('Workflow parameters can only be of class ATTRIBUTE');
    }
    if (_.includes(['WORKFLOW', 'TASK'], args.scope)) args.mapsTo = null;
    args.entityType = 'PARAMETER';
    return table.filter({ parentId: args.parentId })('name').coerceTo('array').do(function (obj) {
      return r.branch(obj.map(function (name) {
        return name.downcase();
      }).contains(r.expr(args.name).downcase()), r.error('A parameter with the name ' + args.name + ' already exists on the current ' + args.scope), table.insert(args, { returnChanges: true })('changes').nth(0)('new_val'));
    }).run(connection);
  };
}

function isParentPublished(backend, id) {
  var r = backend.r;
  var connection = backend.connection;

  var parameter = backend.getTypeCollection('Parameter');
  var workflow = backend.getTypeCollection('Workflow');
  var step = backend.getTypeCollection('Step');
  var task = backend.getTypeCollection('Task');

  return parameter.get(id).do(function (param) {
    return r.branch(param.eq(null), r.error('Parameter does not exist'), r.branch(param('scope').eq('WORKFLOW'), workflow.get(param('parentId')), r.branch(param('scope').eq('TASK'), task.get(param('parentId')), step.get(param('parentId')))).do(function (parent) {
      return r.branch(parent('_temporal')('version').ne(null), true, false);
    }));
  });
}

function updateParameter(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');

    return isParentPublished(backend, args.id).branch(r.error('This parameter belongs to a published record and cannot be modified'), parameter.get(args.id).do(function (param) {
      return r.branch(r.expr(['WORKFLOW', 'TASK']).contains(param('scope')), parameter.get(args.id).update(_.omit(args, 'id', 'mapsTo')).do(function () {
        return parameter.get(args.id);
      }), parameter.get(args.id).update(_.omit(args, 'id')).do(function () {
        return parameter.get(args.id);
      }));
    })).run(connection);
  };
}

function deleteParameter(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');

    return isParentPublished(backend, args.id).branch(r.error('This parameter belongs to a published record and cannot be deleted'), parameter.get(args.id).delete().do(function () {
      return true;
    })).run(connection);
  };
}

var ATTRIBUTE = ParameterClassEnum.values.ATTRIBUTE;


function createParameterRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');
    var table = backend.getTypeCollection('ParameterRun');

    return parameter.get(args.parameter).eq(null).branch(r.error('Parameter ' + args.parameter + ' not found'), table.insert(args, { returnChanges: true })('changes').nth(0)('new_val')).run(connection);
  };
}

function updateParameterRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('ParameterRun');

    return table.get(args.id).eq(null).branch(r.error('ParameterRun not found'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return table.get(args.id);
    })).run(connection);
  };
}

function deleteParameterRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('ParameterRun');

    return table.get(args.id).eq(null).branch(r.error('ParameterRun not found'), table.get(args.id).delete().do(function () {
      return true;
    })).run(connection);
  };
}

function updateAttributeValues(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameterRun = backend.getTypeCollection('ParameterRun');
    var parameter = backend.getTypeCollection('Parameter');

    return r.expr(args.values).forEach(function (value) {
      return parameterRun.get(value('id')).do(function (param) {
        return param.eq(null).branch(r.error('ParameterRun not found'), parameter.get(param('parameter')).do(function (p) {
          return p.eq(null).or(p('class').ne(ATTRIBUTE)).branch(r.error('Invalid Parameter type'), parameterRun.get(value('id')).update({ value: value('value') }));
        }));
      }).do(function () {
        return true;
      });
    }).run(connection);
  };
}

function isPublished(backend, type, id) {
  var r = backend._r;
  var table = backend._db.table(backend._tables[type].table);
  return table.get(id).do(function (obj) {
    return r.branch(obj.eq(null), r.error(type + ' does not exist'), r.branch(obj('_temporal')('version').ne(null), true, false));
  });
}

var _StepTypeEnum$values = StepTypeEnum.values;
var WORKFLOW = _StepTypeEnum$values.WORKFLOW;
var TASK = _StepTypeEnum$values.TASK;


function destroyStep(backend, ids) {
  var r = backend.r;
  var connection = backend.connection;

  var step = backend.getTypeCollection('Step');
  var parameter = backend.getTypeCollection('Parameter');

  ids = _.isString(ids) ? [ids] : ids;
  return step.filter(function (s) {
    return r.expr(ids).contains(s('id'));
  }).delete().do(function () {
    return parameter.filter(function (p) {
      return r.expr(ids).contains(p('parentId'));
    }).delete();
  }).do(function () {
    return true;
  });
}

function createStep(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');
    var workflow = backend.getTypeCollection('Workflow');

    var _globals$_temporal = this.globals._temporal;
    var createTemporalStep = _globals$_temporal.createTemporalStep;
    var filterTemporalTask = _globals$_temporal.filterTemporalTask;


    if (_.includes(['START', 'END'], args.type)) {
      throw new graphql_error.GraphQLError('A ' + args.type + ' type can only be added during new workflow creation');
    }
    if (args.type === 'TASK' && !args.task) {
      throw new graphql_error.GraphQLError('A step of type TASK must specifiy a published tasks recordId');
    }
    args.entityType = 'STEP';

    return workflow.get(args.workflowId).eq(null).branch(r.error('Workflow ' + args.workflowId + ' does not exist'), r.expr(args.type).ne('TASK').branch(createTemporalStep(args)('changes').nth(0)('new_val'), filterTemporalTask({ recordId: args.task }).coerceTo('array').do(function (task) {
      return task.count().eq(0).branch(r.error('The task specified does not have a current published version'), createTemporalStep(r.expr(args).merge({ source: task.nth(0)('source') }))('changes').nth(0)('new_val'));
    }))).run(connection).then(function (step) {
      if (args.type !== 'TASK') return step;

      // copy the current task parameters to the step
      // since it is required that the step already be published there is no need
      // to keep the parameters synced between the step and task
      return filterTemporalTask({ recordId: args.task }).nth(0)('id').do(function (taskId) {
        return parameter.filter({ parentId: taskId }).map(function (param) {
          return param.merge({ id: r.uuid(), scope: 'STEP', parentId: step.id });
        }).forEach(function (p) {
          return parameter.insert(p);
        }).do(function () {
          return step;
        });
      }).run(connection);
    });
  };
}

function readStepThreads(backend) {
  return function () {
    var source = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var args = arguments[1];
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Step');

    switch (source.type) {
      case 'FORK':
        return table.filter({ fork: source.id }).run(connection);
      default:
        return [];
    }
  };
}

function readStep(backend) {
  return function () {
    var source = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var args = arguments[1];
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Step');

    var filterTemporalStep = this.globals._temporal.filterTemporalStep;

    context.date = args.date || context.date;

    if (source.step) return table.get(source.step).run(connection);

    var filter = filterTemporalStep(args);

    if (source.id) {
      filter = table.filter({ workflowId: source.id });
      if (args.first) {
        filter = filter.filter({ type: 'START' }).nth(0).do(function (start) {
          return table.get(start('success')).count().eq(0).branch(r.expr([]), r.expr([table.get(start('success'))]));
        });
      }
    }

    return filter.coerceTo('array').run(connection);
  };
}

function updateStep(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Step');

    return isPublished(backend, 'Step', args.id).branch(r.error('This step is published and cannot be modified'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return table.get(args.id);
    })).run(connection);
  };
}

function deleteStep(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;


    return isPublished(backend, 'Step', args.id).branch(r.error('This step is published and cannot be deleted'), destroyStep(backend, args.id)).run(connection);
  };
}

function readSource(backend) {
  return function () {
    var source = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var args = arguments[1];
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;
    var filterTemporalTask = this.globals._temporal.filterTemporalTask;

    var taskId = _.get(source, 'task') || _.get(source, 'task.id') || null;

    // if not a workflow or task, simply return the source
    if (source.type !== TASK) return _.get(source, 'source', null);

    var vargs = _.keys(source.versionArgs).length ? source.versionArgs : _.merge(_.omit(context, ['id', 'recordId']), { recordId: taskId });

    return filterTemporalTask(vargs).coerceTo('array').do(function (t) {
      return t.count().eq(0).branch(null, t.nth(0).hasFields('source').branch(t.nth(0)('source'), null));
    }).run(connection);
  };
}

function readStepParams(backend) {
  return function () {
    var source = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var args = arguments[1];
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;
    var _globals$_temporal2 = this.globals._temporal;
    var filterTemporalWorkflow = _globals$_temporal2.filterTemporalWorkflow;
    var filterTemporalTask = _globals$_temporal2.filterTemporalTask;

    var parameter = backend.getTypeCollection('Parameter');
    context = _.omit(context, ['recordId', 'id']);

    return r.expr(source).do(function (s) {
      return r.expr([WORKFLOW, TASK]).contains(s('type')).branch(s.hasFields('versionArgs').branch(s('versionArgs').keys().count().ne(0).branch(s('versionArgs'), r.expr(context)), r.expr(context)).do(function (vargs) {
        return r.branch(s('type').eq(WORKFLOW).and(s.hasFields('subWorkflow')), filterTemporalWorkflow(vargs.merge({ recordId: s('subWorkflow') })), s('type').eq(TASK).and(s.hasFields('task')), filterTemporalTask(vargs.merge({ recordId: s('task') })), r.error('Temporal relation missing reference')).coerceTo('array').do(function (recs) {
          return recs.count().eq(0).branch(null, recs.nth(0)('id'));
        });
      }), s('id')).do(function (id) {
        return parameter.filter({ parentId: id }).coerceTo('array');
      });
    }).run(connection);
  };
}

var INPUT = ParameterClassEnum.values.INPUT;
var _RunStatusEnum$values = RunStatusEnum.values;
var FORKED = _RunStatusEnum$values.FORKED;
var CREATED = _RunStatusEnum$values.CREATED;
var RUNNING = _RunStatusEnum$values.RUNNING;
var FORK = StepTypeEnum.values.FORK;


function newStepRun(backend, args, id) {
  var returnChanges = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
  var checkThread = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
  var r = backend.r;

  var thread = backend.getTypeCollection('WorkflowRunThread');
  var step = backend.getTypeCollection('Step');
  var stepRun = backend.getTypeCollection('StepRun');
  var parameterRun = backend.getTypeCollection('ParameterRun');
  var parameter = backend.getTypeCollection('Parameter');
  var workflowRun = backend.getTypeCollection('WorkflowRun');

  // verify the step is valid
  return step.get(args.step)

  // generate an error message if not valid or stepRun uuid if valid
  .do(function (_step) {
    return _step.eq(null).branch(r.error('Step does not exist'), id);
  }).do(function (stepRunId) {
    return thread.get(args.workflowRunThread)

    // verify the thread exists
    .do(function (_thread) {
      return _thread.eq(null).and(r.expr(checkThread).eq(true)).branch(r.error('Workflow Run Thread not found'), r.expr(args).hasFields('workflowRun').branch(r.expr(args)('workflowRun'), _thread('workflowRun')).do(function (wfRunId) {
        return wfRunId.eq(null).branch(r.error('Unable to determine workflow run ID'), wfRunId);
      }));
    }).do(function (wfRunId) {

      // get the workflowRun for its input
      return workflowRun.get(wfRunId).do(function (wfRun) {
        return wfRun.eq(null).branch(r.error('WorkflowRun not found'), parameter.filter({ parentId: args.step, class: INPUT }).coerceTo('array').map(function (_param) {
          return {
            parameter: _param('id'),
            parentId: stepRunId,
            value: _param.hasFields('mapsTo').and(_param('mapsTo').ne(null)).branch(parameterRun.filter({ parentId: wfRunId, parameter: _param('mapsTo') }).coerceTo('array').do(function (ctxParam) {
              return ctxParam.count().gt(0).branch(ctxParam.nth(0)('value'), wfRun('input').hasFields(_param('name')).branch(wfRun('input')(_param('name')), _param.hasFields('defaultValue').branch(_param('defaultValue'), null)));
            }), wfRun('input').hasFields(_param('name')).branch(wfRun('input')(_param('name')), _param.hasFields('defaultValue').branch(_param('defaultValue'), null)))
          };
        }).do(function (paramRuns) {
          return parameterRun.insert(paramRuns);
        }).do(function () {
          return stepRun.insert({
            id: stepRunId,
            workflowRunThread: args.workflowRunThread,
            step: args.step,
            started: r.now(),
            status: CREATED
          }, { returnChanges: returnChanges });
        }));
      });
    });
  });
}

/*

Args:

step (id),
workflowRunThread (id)
input (JSON)

 */
function createStepRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    return newStepRun(backend, args, r.uuid())('changes').nth(0)('new_val').run(connection);
  };
}

function startStepRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('StepRun');

    args.started = r.now();
    args.status = RUNNING;

    return table.get(args.id).do(function (stepRun) {
      return stepRun.eq(null).branch(r.error('StepRun not found'), stepRun('status').ne(CREATED).branch(r.error('StepRun is not in a state that can be started'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
        return true;
      })));
    }).run(connection);
  };
}

function endStepRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('StepRun');

    args.ended = r.now();

    return table.get(args.id).eq(null).branch(r.error('StepRun not found'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return true;
    })).run(connection);
  };
}

function createForks(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var workflowRun = backend.getTypeCollection('WorkflowRun');
    var thread = backend.getTypeCollection('WorkflowRunThread');
    var step = backend.getTypeCollection('Step');

    return workflowRun.get(args.workflowRun).do(function (wfRun) {
      return wfRun.eq(null).branch(r.error('Workflow run does not exist'), wfRun);
    }).do(function () {
      return step.get(args.step).do(function (s) {
        return s.eq(null).branch(r.error('Step does not exist'), s('type').ne(FORK).branch(r.error('Step is not a FORK'), step.filter({ fork: s('id') }).coerceTo('array').map(function (forked) {
          return {
            threadId: r.uuid(),
            stepRunId: r.uuid(),
            step: forked('id')
          };
        }).do(function (val) {
          return val.forEach(function (v) {
            return newStepRun(backend, {
              workflowRun: args.workflowRun,
              step: v('step'),
              workflowRunThread: v('threadId')
            }, v('stepRunId'), false, false);
          }).do(function () {
            return thread.get(args.workflowRunThread).do(function (parentThread) {
              return parentThread.eq(null).branch(r.error('Parent thread does not exist'), thread.get(args.workflowRunThread).update({ status: FORKED }));
            });
          }).do(function () {
            return val.map(function (v) {
              return {
                id: v('threadId'),
                workflowRun: args.workflowRun,
                currentStepRun: v('stepRunId'),
                status: CREATED,
                parentThread: args.workflowRunThread
              };
            }).coerceTo('array').do(function (d) {
              return thread.insert(d, { returnChanges: true })('changes')('new_val');
            });
          });
        })));
      });
    }).run(connection);
  };
}

function getJoinThreads(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var thread = backend.getTypeCollection('WorkflowRunThread');
    var step = backend.getTypeCollection('Step');
    var stepRun = backend.getTypeCollection('StepRun');

    // first get steps that should be joined
    return step.filter({ join: args.step })('id').coerceTo('array').do(function (joins) {

      // then get threads
      return thread.filter({ workflowRun: args.workflowRun }).merge(function (t) {
        return {
          step: stepRun.get(t('currentStepRun')).do(function (sr) {
            return step.get(sr('step'))('id');
          })
        };
      }).filter(function (tr) {
        return joins.contains(tr('step'));
      }).coerceTo('array');
    }).run(connection);
  };
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var UPDATE = 'update';
var INSERT = 'insert';

var END = StepTypeEnum.values.END;
var _EntityTypeEnum$value = EntityTypeEnum.values;
var PARAMETER = _EntityTypeEnum$value.PARAMETER;
var WORKFLOW$1 = _EntityTypeEnum$value.WORKFLOW;
var STEP = _EntityTypeEnum$value.STEP;

var FolderType = FolderChildTypeEnum.values;

function isNewId(id) {
  return id.match(/^new:/) !== null;
}

function mapIds(args, r, workflow) {
  var id = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

  var ids = {
    recordId: workflow.get(id).eq(null).branch(r.uuid(), workflow.get(id)('_temporal')('recordId'))
  };

  // workflow id
  ids[args.id] = isNewId(args.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: args.id };

  // workflow parameters
  _.forEach(args.parameters, function (param) {
    ids[param.id] = isNewId(param.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: param.id };
  });

  // steps
  _.forEach(args.steps, function (step) {
    ids[step.id] = isNewId(step.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: step.id };
    _.forEach(step.parameters, function (param) {
      ids[param.id] = isNewId(param.id) ? { op: INSERT, id: r.uuid() } : { op: UPDATE, id: param.id };
    });
  });

  return ids;
}

function getOp(ids, uuid, prefix) {
  var _ref;

  var _$get = _.get(ids, uuid, {});

  var op = _$get.op;
  var id = _$get.id;

  return _ref = {}, defineProperty(_ref, prefix + 'Id', id), defineProperty(_ref, prefix + 'Op', op), _ref;
}

function syncWorkflow(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');
    var workflow = backend.getTypeCollection('Workflow');
    var step = backend.getTypeCollection('Step');
    var folder = backend.getTypeCollection('Folder');
    var membership = backend.getTypeCollection('FolderMembership');
    var owner = args.owner || null;

    var makeTemporal = function makeTemporal(obj, recordId) {
      return _.merge(obj, {
        _temporal: {
          recordId: recordId,
          name: 'initial',
          validFrom: null,
          validTo: null,
          version: null,
          owner: owner,
          changeLog: [{
            type: 'CREATE',
            user: owner,
            message: 'created workflow'
          }]
        }
      });
    };

    return r.expr(mapIds(args, r, workflow, args.id)).run(connection).then(function (ids) {
      var _op;

      var isNewWorkflow = false;
      var mutations = [];
      var forks = [];
      var steps = [];
      var params = {};
      var op = (_op = {}, defineProperty(_op, INSERT, { workflow: {}, parameter: {}, step: {} }), defineProperty(_op, UPDATE, { workflow: {}, parameter: {}, step: {} }), _op);

      // re-map workflow

      var _getOp = getOp(ids, args.id, 'wf');

      var wfId = _getOp.wfId;
      var wfOp = _getOp.wfOp;

      var wfObj = { id: wfId, entityType: WORKFLOW$1 };
      params[wfId] = [];
      if (wfOp === INSERT) {
        isNewWorkflow = true;
        makeTemporal(wfObj, ids.recordId);
      }
      _.set(op, '["' + wfOp + '"].workflow["' + wfId + '"]', _.merge({}, _.omit(args, ['parameters', 'steps', '_temporal.owner', '_temporal.name']), wfObj));

      // re-map attributes
      _.forEach(args.parameters, function (param) {
        var _getOp2 = getOp(ids, param.id, 'param');

        var paramId = _getOp2.paramId;
        var paramOp = _getOp2.paramOp;

        params[wfId].push(paramId);
        _.set(op, '["' + paramOp + '"].parameter["' + paramId + '"]', _.merge({}, param, {
          id: paramId,
          parentId: wfId,
          scope: ParameterScopeEnum.ATTRIBUTE,
          entityType: PARAMETER
        }));
      });

      // re-map steps
      _.forEach(args.steps, function (step) {
        var _getOp3 = getOp(ids, step.id, 'step');

        var stepId = _getOp3.stepId;
        var stepOp = _getOp3.stepOp;

        params[stepId] = [];
        steps.push(stepId);
        var stepObj = {
          id: stepId,
          success: _.get(ids, '["' + step.success + '"].id', null),
          fail: _.get(ids, '["' + step.fail + '"].id', null),
          task: _.get(step, 'task._temporal.recordId'),
          subWorkflow: _.get(step, 'subWorkflow._temporal.recordId'),
          entityType: STEP,
          workflowId: wfId
        };
        if (stepOp === INSERT) makeTemporal(stepObj);
        _.set(op, '["' + stepOp + '"].step["' + stepId + '"]', _.merge({}, _.omit(step, ['threads', 'parameters']), stepObj));

        // re-map step params
        _.forEach(step.parameters, function (param) {
          var _getOp4 = getOp(ids, param.id, 'param');

          var paramId = _getOp4.paramId;
          var paramOp = _getOp4.paramOp;

          params[stepId].push(paramId);
          _.set(op, '["' + paramOp + '"].parameter["' + paramId + '"]', _.merge({}, param, {
            id: paramId,
            parentId: stepId,
            scope: ParameterScopeEnum.STEP,
            entityType: PARAMETER
          }));
        });
      });

      // apply forks
      _.forEach(args.steps, function (step) {
        var _getOp5 = getOp(ids, step.id, 'step');

        var stepId = _getOp5.stepId;

        if (step.threads.length) forks.push(stepId);
        _.forEach(step.threads, function (thread) {
          var _getOp6 = getOp(ids, thread.id, 'thread');

          var threadId = _getOp6.threadId;

          if (threadId) {
            var s = _.get(op[INSERT].step, threadId) || _.get(op[UPDATE].step, threadId);
            if (s) s.fork = stepId;
          }
        });
      });

      // remove deleted forks
      _.forEach(args.steps, function (step) {
        var _getOp7 = getOp(ids, step.id, 'step');

        var stepId = _getOp7.stepId;

        var s = _.get(op[INSERT].step, stepId) || _.get(op[UPDATE].step, stepId);
        s.fork = _.includes(forks, s.fork) ? s.fork : null;
      });

      // create a flattened array of actions
      _.forEach(op, function (colls, opName) {
        _.forEach(colls, function (coll, collName) {
          _.forEach(coll, function (obj, objId) {
            mutations.push({
              id: objId,
              op: opName,
              collection: collName,
              data: obj
            });
          });
        });
      });

      // process all mutations
      return r.expr(mutations).forEach(function (m) {
        return m('op').eq(INSERT).branch(r.branch(m('collection').eq('workflow'), workflow.insert(m('data')), m('collection').eq('step'), step.insert(m('data')), parameter.insert(m('data'))), r.branch(m('collection').eq('workflow'), workflow.get(m('id')).update(m('data')), m('collection').eq('step'), step.get(m('id')).update(m('data')), parameter.get(m('id')).update(m('data'))));
      })
      // folder updates
      .do(function () {
        return folder.get(args.folder || '').ne(null).branch(r.expr(isNewWorkflow).branch(membership.insert({
          folder: args.folder,
          childId: ids.recordId,
          childType: FolderType.WORKFLOW
        }), membership.get(ids.recordId).update({ folder: args.folder })), folder.filter({ type: FolderType.WORKFLOW, parent: FolderType.ROOT }).nth(0).do(function (rootFolder) {
          return r.expr(isNewWorkflow).branch(membership.insert({
            folder: rootFolder('id'),
            childId: ids.recordId,
            childType: FolderType.WORKFLOW
          }), membership.get(ids.recordId).update({ folder: rootFolder('id') }));
        }));
      })
      // remove steps that no longer exist
      .do(function () {
        return step.filter({ workflowId: wfId }).filter(function (st) {
          return r.expr(steps).contains(st('id')).not();
        }).forEach(function (st) {
          return parameter.filter({ parentId: st('id') }).delete().do(function () {
            return step.get(st('id')).delete();
          });
        });
      })
      // remove parameters that are no longer used
      .do(function () {
        var paramMap = _.map(params, function (parameters, parentId) {
          return { parentId: parentId, parameters: parameters };
        });
        return r.expr(paramMap).forEach(function (p) {
          return parameter.filter({ parentId: p('parentId') }).filter(function (pm) {
            return p('parameters').contains(pm('id')).not();
          }).delete();
        });
      }).do(function () {
        return workflow.get(wfId);
      }).run(connection);
    });
  };
}

var UPDATE$1 = 'update';
var INSERT$1 = 'insert';

var _EntityTypeEnum$value$1 = EntityTypeEnum.values;
var PARAMETER$1 = _EntityTypeEnum$value$1.PARAMETER;
var TASK$1 = _EntityTypeEnum$value$1.TASK;

var FolderType$1 = FolderChildTypeEnum.values;

function isNewId$1(id) {
  return id.match(/^new:/) !== null;
}

function mapIds$1(args, r, task) {
  var id = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

  var ids = {
    recordId: task.get(id).eq(null).branch(r.uuid(), task.get(id)('_temporal')('recordId'))
  };

  // task id
  ids[args.id] = isNewId$1(args.id) ? { op: INSERT$1, id: r.uuid() } : { op: UPDATE$1, id: args.id };

  // task parameters
  _.forEach(args.parameters, function (param) {
    ids[param.id] = isNewId$1(param.id) ? { op: INSERT$1, id: r.uuid() } : { op: UPDATE$1, id: param.id };
  });

  return ids;
}

function getOp$1(ids, uuid, prefix) {
  var _ref;

  var _$get = _.get(ids, uuid, {});

  var op = _$get.op;
  var id = _$get.id;

  return _ref = {}, defineProperty(_ref, prefix + 'Id', id), defineProperty(_ref, prefix + 'Op', op), _ref;
}

function syncTask(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var task = backend.getTypeCollection('Task');
    var parameter = backend.getTypeCollection('Parameter');
    var folder = backend.getTypeCollection('Folder');
    var membership = backend.getTypeCollection('FolderMembership');
    var owner = args.owner || null;

    var makeTemporal = function makeTemporal(obj, recordId) {
      return _.merge(obj, {
        _temporal: {
          recordId: recordId,
          name: 'initial',
          validFrom: null,
          validTo: null,
          version: null,
          owner: owner,
          changeLog: [{
            type: 'CREATE',
            user: owner,
            message: 'created workflow'
          }]
        }
      });
    };

    return r.expr(mapIds$1(args, r, task, args.id)).run(connection).then(function (ids) {
      var _op;

      var isNewTask = false;
      var mutations = [];
      var params = [];
      var op = (_op = {}, defineProperty(_op, INSERT$1, { task: {}, parameter: {} }), defineProperty(_op, UPDATE$1, { task: {}, parameter: {} }), _op);

      // re-map workflow

      var _getOp = getOp$1(ids, args.id, 'task');

      var taskId = _getOp.taskId;
      var taskOp = _getOp.taskOp;

      var taskObj = { id: taskId, entityType: TASK$1 };

      if (taskOp === INSERT$1) {
        isNewTask = true;
        makeTemporal(taskObj, ids.recordId);
      }
      _.set(op, '["' + taskOp + '"].task["' + taskId + '"]', _.merge({}, _.omit(args, ['parameters', 'steps', '_temporal.owner', '_temporal.name']), taskObj));

      // re-map parameters
      _.forEach(args.parameters, function (param) {
        var _getOp2 = getOp$1(ids, param.id, 'param');

        var paramId = _getOp2.paramId;
        var paramOp = _getOp2.paramOp;

        params.push(paramId);
        _.set(op, '["' + paramOp + '"].parameter["' + paramId + '"]', _.merge({}, param, {
          id: paramId,
          parentId: taskId,
          scope: ParameterScopeEnum.TASK,
          entityType: PARAMETER$1
        }));
      });

      // create a flattened array of actions
      _.forEach(op, function (colls, opName) {
        _.forEach(colls, function (coll, collName) {
          _.forEach(coll, function (obj, objId) {
            mutations.push({
              id: objId,
              op: opName,
              collection: collName,
              data: obj
            });
          });
        });
      });

      // process all mutations
      return r.expr(mutations).forEach(function (m) {
        return m('op').eq(INSERT$1).branch(r.branch(m('collection').eq('task'), task.insert(m('data')), parameter.insert(m('data'))), r.branch(m('collection').eq('task'), task.get(m('id')).update(m('data')), parameter.get(m('id')).update(m('data'))));
      })
      // folder updates
      .do(function () {
        return folder.get(args.folder || '').ne(null).branch(r.expr(isNewTask).branch(membership.insert({
          folder: args.folder,
          childId: ids.recordId,
          childType: FolderType$1.TASK
        }), membership.get(ids.recordId).update({ folder: args.folder })), folder.filter({ type: FolderType$1.TASK, parent: FolderType$1.ROOT }).nth(0).do(function (rootFolder) {
          return r.expr(isNewTask).branch(membership.insert({
            folder: rootFolder('id'),
            childId: ids.recordId,
            childType: FolderType$1.TASK
          }), membership.get(ids.recordId).update({ folder: rootFolder('id') }));
        }));
      })
      // remove parameters that are no longer used
      .do(function () {
        return parameter.filter({ parentId: taskId }).filter(function (p) {
          return r.expr(params).contains(p('id')).not();
        }).delete();
      }).do(function () {
        return task.get(taskId);
      }).run(connection);
    });
  };
}

function createTask(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Task');

    var createTemporalTask = this.globals._temporal.createTemporalTask;

    args.entityType = 'TASK';
    return table.filter(function (t) {
      return t('name').match('(?i)^' + args.name + '$');
    }).count().ne(0).branch(r.error('A task with the name ' + args.name + ' already exists'), createTemporalTask(args)('changes').nth(0)('new_val')).run(connection);
  };
}

function readTask(backend) {
  return function (source, args) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var sourceTask = _.get(source, 'task') || _.get(source, 'task.id');

    var _globals$_temporal = this.globals._temporal;
    var filterTemporalTask = _globals$_temporal.filterTemporalTask;
    var mostCurrentTemporalTask = _globals$_temporal.mostCurrentTemporalTask;

    context.date = args.date || context.date;
    var filter = r.expr(null);
    if (!source) {
      if (!_.keys(args).length) return mostCurrentTemporalTask().run(connection);
      filter = filterTemporalTask(args);
    } else if (sourceTask) {
      filter = filterTemporalTask({ recordId: sourceTask, date: context.date }).coerceTo('array').do(function (task) {
        return task.count().eq(0).branch(null, task.nth(0));
      });
    }
    return filter.run(connection);
  };
}

function readTaskVersions(backend) {
  return function (source, args) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Task');
    var filter = table.filter({ _temporal: { recordId: args.recordId } });
    if (args.offset) filter = filter.skip(args.offset);
    if (args.limit) filter = filter.limit(args.limit);
    return filter.run(connection);
  };
}

function updateTask(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Task');

    return isPublished(backend, 'Task', args.id).branch(r.error('This task is published and cannot be modified'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return table.get(args.id);
    })).run(connection);
  };
}

function deleteTask(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var task = backend.getTypeCollection('Task');
    var parameter = backend.getTypeCollection('Parameter');
    var step = backend.getTypeCollection('Step');

    return isPublished(backend, 'Task', args.id).branch(r.error('This task is published and cannot be deleted'), step.filter(function (s) {
      return s('task').eq(args.id).and(s('_temporal')('version').ne(null));
    }).count().ne(0).branch(r.error('This task belongs to a published step and cannot be deleted'), task.get(args.id).delete().do(function () {
      return parameter.filter({ parentId: args.id }).delete().do(function () {
        return true;
      });
    }))).run(connection);
  };
}

var _StepTypeEnum$values$1 = StepTypeEnum.values;
var TASK$2 = _StepTypeEnum$values$1.TASK;
var WORKFLOW$2 = _StepTypeEnum$values$1.WORKFLOW;
var END$1 = _StepTypeEnum$values$1.END;
var _ParameterClassEnum$v = ParameterClassEnum.values;
var INPUT$1 = _ParameterClassEnum$v.INPUT;
var ATTRIBUTE$1 = _ParameterClassEnum$v.ATTRIBUTE;


function getFullWorkflow(backend, args) {
  var r = backend.r;
  var connection = backend.connection;

  var workflow = backend.getTypeCollection('Workflow');
  var parameter = backend.getTypeCollection('Parameter');
  var step = backend.getTypeCollection('Step');

  return workflow.get(args.id).eq(null).branch(r.error('Invalid workflow version'), workflow.get(args.id).merge(function (w) {
    return {
      parameters: parameter.filter({ parentId: args.id }).coerceTo('array'),
      steps: step.filter({ workflowId: w('id') }).coerceTo('array').merge(function (s) {
        return {
          parameters: parameter.filter({ parentId: s('id') }).coerceTo('array')
        };
      })
    };
  }));
}

function getNewUuids(type, r, wf) {
  var remap = type === 'fork' ? ['FORKID'] : [];
  remap.push(wf.id);
  _.forEach(wf.parameters, function (p) {
    return remap.push(p.id);
  });
  _.forEach(wf.steps, function (s) {
    remap.push(s.id);
    _.forEach(s.parameters, function (p) {
      return remap.push(p.id);
    });
  });
  // map new uuids
  return r.expr(remap).map(function (id) {
    return { orig: id, cur: r.uuid() };
  });
}

function remapObjects(wf, idmap) {
  var newSteps = [];
  var newParams = [];

  // create the new workflow
  var newWorkflow = _.merge({}, _.omit(wf, ['steps', 'parameters']));
  if (idmap.FORKID) newWorkflow._temporal.recordId = idmap.FORKID;
  newWorkflow._temporal.version = null;
  newWorkflow._temporal.validFrom = null;
  newWorkflow._temporal.validTo = null;
  newWorkflow._temporal.changeLog = _.isArray(wf._temporal.changeLog) ? wf._temporal.changeLog : [];
  newWorkflow.id = idmap[wf.id];

  // start creating the new parameters, steps, and workflows
  _.forEach(wf.parameters, function (p) {
    newParams.push(_.merge({}, p, { id: idmap[p.id], parentId: idmap[p.parentId] }));
  });

  _.forEach(wf.steps, function (s) {
    var st = _.merge({}, s);
    st._temporal.version = null;
    st._temporal.validFrom = null;
    st._temporal.validTo = null;
    st.id = _.get(idmap, s.id, null);
    st.workflowId = _.get(idmap, s.workflowId, null);
    st.success = _.get(idmap, s.success, null);
    st.fork = _.get(idmap, s.fork, null);
    st.fail = _.get(idmap, s.fail, null);
    newSteps.push(st);

    _.forEach(s.parameters, function (p) {
      newParams.push(_.merge({}, p, { id: idmap[p.id], parentId: idmap[p.parentId] }));
    });
  });
  return { newWorkflow: newWorkflow, newParams: newParams, newSteps: newSteps };
}

function cloneWorkflow(type, backend, args) {
  var r = backend.r;
  var connection = backend.connection;

  var workflow = backend.getTypeCollection('Workflow');
  var parameter = backend.getTypeCollection('Parameter');
  var step = backend.getTypeCollection('Step');

  var idmap = {};

  // first get the entire workflow version as 1 object
  return getFullWorkflow(backend, args).run(connection).then(function (wf) {
    return getNewUuids(type, r, wf).run(connection).then(function (uuids) {
      _.forEach(uuids, function (m) {
        return idmap[m.orig] = m.cur;
      });

      var _remapObjects = remapObjects(wf, idmap, args);

      var newWorkflow = _remapObjects.newWorkflow;
      var newSteps = _remapObjects.newSteps;
      var newParams = _remapObjects.newParams;

      newWorkflow._temporal.name = args.name || newWorkflow.id;
      newWorkflow._temporal.owner = args.owner || null;
      newWorkflow._temporal.changeLog.push(_.merge(args.changeLog || { user: 'SYSTEM', message: type }, {
        date: r.now(),
        type: type === 'branch' ? 'BRANCH' : 'FORK'
      }));

      return r.expr([parameter.insert(newParams), step.insert(newSteps)]).do(function () {
        return workflow.insert(newWorkflow, { returnChanges: true })('changes').nth(0)('new_val');
      }).run(connection);
    });
  });
}

function branchWorkflow(backend) {
  return function (source, args, context, info) {
    return cloneWorkflow('branch', backend, args);
  };
}

function forkWorkflow(backend) {
  return function (source, args, context, info) {
    return cloneWorkflow('fork', backend, args);
  };
}

function publishWorkflow(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var step = backend.getTypeCollection('Step');
    var tableName = backend.getTypeComputed('Workflow').collection;

    var extendPublish = this.globals._temporal.extendPublish;

    return extendPublish(tableName, args).then(function (wf) {
      var _wf$_temporal = wf._temporal;
      var version = _wf$_temporal.version;
      var validFrom = _wf$_temporal.validFrom;
      var validTo = _wf$_temporal.validTo;
      var id = wf.id;

      return step.filter({ workflowId: id }).update({ _temporal: { version: version, validFrom: validFrom, validTo: validTo } }).run(connection).then(function () {
        return wf;
      });
    });
  };
}

function readWorkflowInputs(backend) {
  return function (source, args) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');
    var step = backend.getTypeCollection('Step');

    return step.filter({ workflowId: source.id }).map(function (s) {
      return parameter.filter({
        parentId: s('id'),
        class: INPUT$1
      }).filter(function (param) {
        return param.hasFields('mapsTo').branch(param('mapsTo').eq(null).or(param('mapsTo').eq('')), true);
      }).coerceTo('array');
    }).reduce(function (left, right) {
      return left.union(right);
    }).run(connection);
  };
}

function createWorkflow(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;
    var _globals$_temporal = this.globals._temporal;
    var createTemporalWorkflow = _globals$_temporal.createTemporalWorkflow;
    var createTemporalStep = _globals$_temporal.createTemporalStep;

    return r.do(r.uuid(), r.uuid(), r.uuid(), function (wfId, startId, endId) {
      args.id = wfId;
      args.entityType = 'WORKFLOW';
      return createTemporalStep([{
        id: startId,
        entityType: 'STEP',
        name: 'Start',
        description: 'Starting point of the workflow',
        type: 'START',
        timeout: 0,
        failsWorkflow: false,
        waitOnSuccess: false,
        requireResumeKey: false,
        success: endId,
        fail: endId,
        workflowId: wfId
      }, {
        id: endId,
        entityType: 'STEP',
        name: 'End',
        description: 'Ending point of the workflow',
        type: 'END',
        timeout: 0,
        failsWorkflow: false,
        waitOnSuccess: false,
        requireResumeKey: false,
        success: endId,
        fail: endId,
        workflowId: wfId
      }]).do(function () {
        return createTemporalWorkflow(args)('changes').nth(0)('new_val');
      });
    }).run(connection);
  };
}

function readWorkflow(backend) {
  return function (source, args) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Workflow');
    var _globals$_temporal2 = this.globals._temporal;
    var filterTemporalWorkflow = _globals$_temporal2.filterTemporalWorkflow;
    var mostCurrentTemporalWorkflow = _globals$_temporal2.mostCurrentTemporalWorkflow;

    context.date = args.date || context.date;
    var filter = r.expr(null);
    if (_.isEmpty(source)) {
      if (!_.keys(args).length) return mostCurrentTemporalWorkflow().run(connection);
      filter = filterTemporalWorkflow(args);
    } else if (source.workflow) {
      return table.get(source.workflow).run(connection);
    } else if (source.subWorkflow) {
      filter = filterTemporalWorkflow({ recordId: source.subWorkflow, date: context.date }).coerceTo('array').do(function (task) {
        return task.count().eq(0).branch(null, task.nth(0));
      });
    }
    return filter.run(connection);
  };
}

function readWorkflowVersions(backend) {
  return function (source, args) {
    var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var info = arguments[3];
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Workflow');
    var filter = table.filter({ _temporal: { recordId: args.recordId } });
    if (args.offset) filter = filter.skip(args.offset);
    if (args.limit) filter = filter.limit(args.limit);
    return filter.run(connection);
  };
}

function updateWorkflow(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('Workflow');

    return isPublished(backend, 'Workflow', args.id).branch(r.error('This workflow is published and cannot be modified'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return table.get(args.id);
    })).run(connection);
  };
}

function deleteWorkflow(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var workflow = backend.getTypeCollection('Workflow');
    var parameter = backend.getTypeCollection('Parameter');
    var step = backend.getTypeCollection('Step');

    return isPublished(backend, 'Workflow', args.id).branch(r.error('This workflow is published and cannot be deleted'), step.filter({ workflowId: args.id }).map(function (s) {
      return s('id');
    }).coerceTo('array').do(function (ids) {
      return destroyStep(backend, ids);
    }).do(function () {
      return parameter.filter({ parentId: args.id }).delete();
    }).do(function () {
      return workflow.get(args.id).delete().do(function () {
        return true;
      });
    })).run(connection);
  };
}

function readWorkflowParameters(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var parameter = backend.getTypeCollection('Parameter');

    return parameter.filter({ parentId: source.id, class: ATTRIBUTE$1 }).run(connection);
  };
}

function readEndStep(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var step = backend.getTypeCollection('Step');

    return step.filter({ workflowId: source.id, type: END$1 }).coerceTo('array').do(function (end) {
      return end.count().eq(0).branch(null, end.nth(0));
    }).run(connection);
  };
}

var _ParameterClassEnum$v$1 = ParameterClassEnum.values;
var INPUT$2 = _ParameterClassEnum$v$1.INPUT;
var OUTPUT = _ParameterClassEnum$v$1.OUTPUT;


function expandGQLErrors(errors) {
  if (_.isArray(errors)) {
    return _.map(errors, function (e) {
      try {
        return _.isObject(e) ? JSON.stringify(e) : e;
      } catch (err) {
        return e;
      }
    });
  }
  try {
    return _.isObject(errors) ? JSON.stringify(errors) : errors;
  } catch (err) {
    return errors;
  }
}

function gqlResult(backend, result, cb) {
  var GraphQLError = backend.graphql.GraphQLError;
  if (result.errors) return cb(new GraphQLError(expandGQLErrors(result.errors)));
  return cb(null, result.data);
}

function convertType(type, name, value) {
  if (!type || !name) throw new Error('could not determine type of variable name to convert');
  switch (type) {
    case 'ARRAY':
      if (_.isString(value)) {
        try {
          value = JSON.parse(value);
        } catch (err) {}
      }
      if (_.isArray(value)) return value;
    case 'BOOLEAN':
      var strBoolean = ['true', 'TRUE', 'false', 'FALSE', 0, 1, '0', '1'];
      if (_.isBoolean(value) || _.includes(strBoolean, value)) return Boolean(value);
    case 'DATE':
      try {
        return new Date(value);
      } catch (err) {}
    case 'NUMBER':
      if (_.isNumber(value)) return Number(value);
    case 'OBJECT':
      if (_.isString(value)) {
        try {
          value = JSON.parse(value);
        } catch (err) {}
      }
      if (_.isObject(value)) return value;
    case 'STRING':
      if (_.isString(value)) return String(value);
    default:
      throw new Error(name + ' could not be cast to type ' + type);
  }
}

function mapInput(input, context, parameters) {
  var params = {};

  _.forEach(parameters, function (param) {
    if (param.class === OUTPUT) {
      params[param.name] = null;
    } else if (param.class === INPUT$2) {
      if (param.mapsTo) {
        var _ref = _.find(context, function (ctx) {
          return _.get(ctx, 'parameter.id') === param.mapsTo;
        }) || {};

        var parameter = _ref.parameter;
        var value = _ref.value;

        if (parameter) params[param.name] = value;
      } else {
        try {
          params[param.name] = convertType(param.type, param.name, _.get(input, param.name));
        } catch (err) {}
      }
    }
  });

  return params;
}

function winTieBreak(thread, ending) {
  if (!_.without(ending, thread).length) return true;
  return ending.sort()[0] === thread;
}

function createWorkflowRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var workflowRun = backend.getTypeCollection('WorkflowRun');
    var parameterRun = backend.getTypeCollection('ParameterRun');
    var stepRun = backend.getTypeCollection('StepRun');
    var workflowRunThread = backend.getTypeCollection('WorkflowRunThread');

    return r.do(r.now(), r.uuid(), r.uuid(), r.uuid(), function (now, workflowRunId, stepRunId, workflowRunThreadId) {
      return workflowRun.insert({
        id: workflowRunId,
        workflow: args.workflow,
        args: args.args,
        input: args.input,
        started: now,
        status: 'RUNNING',
        parentStepRun: args.parent
      }, { returnChanges: true })('changes').nth(0)('new_val').do(function (wfRun) {
        return workflowRunThread.insert({
          id: workflowRunThreadId,
          workflowRun: workflowRunId,
          currentStepRun: stepRunId,
          status: 'CREATED'
        }).do(function () {
          if (!args.parameters || !args.parameters.length) return null;
          return parameterRun.insert(_.map(args.parameters, function (param) {
            return {
              parameter: param.id,
              parentId: workflowRunId,
              class: param.class,
              value: _.get(param, 'defaultValue')
            };
          }));
        }).do(function () {
          return stepRun.insert({
            id: stepRunId,
            workflowRunThread: workflowRunThreadId,
            step: args.step.id,
            status: 'CREATED'
          });
        }).do(function () {
          if (!args.step.parameters.length) return null;
          var p = [];
          // map the input and attributes to the local step params
          _.forEach(args.step.parameters, function (param) {
            var paramValue = null;
            if (param.mapsTo) {
              paramValue = _.get(_.find(args.parameters, { id: param.mapsTo }), 'defaultValue');
            } else if (!param.mapsTo && _.has(args.input, param.name)) {
              try {
                paramValue = convertType(param.type, param.name, _.get(args.input, param.name));
              } catch (err) {}
            }
            p.push({
              parameter: param.id,
              parentId: stepRunId,
              class: param.class,
              value: paramValue
            });
          });
          return parameterRun.insert(p);
        }).do(function () {
          return wfRun;
        });
      });
    }).run(connection);
  };
}

function updateWorkflowRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('WorkflowRun');

    return table.get(args.id).eq(null).branch(r.error('WorkflowRun not found'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return table.get(args.id);
    })).run(connection);
  };
}

function deleteWorkflowRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('WorkflowRun');

    return table.get(args.id).eq(null).branch(r.error('WorkflowRun not found'), table.get(args.id).delete().do(function () {
      return true;
    })).run(connection);
  };
}

function endWorkflowRun(backend) {
  return function (source, args, context, info) {
    var r = backend.r;
    var connection = backend.connection;

    var table = backend.getTypeCollection('WorkflowRun');

    args.ended = r.now();

    return table.get(args.id).eq(null).branch(r.error('WorkflowRun not found'), table.get(args.id).update(_.omit(args, 'id')).do(function () {
      return true;
    })).run(connection);
  };
}

var functions = {
  createFolder: createFolder,
  readFolder: readFolder,
  updateFolder: updateFolder,
  deleteFolder: deleteFolder,
  readRootFolder: readRootFolder,
  readSubFolder: readSubFolder,
  readWorkflowFolder: readWorkflowFolder,
  createParameter: createParameter,
  updateParameter: updateParameter,
  deleteParameter: deleteParameter,
  createParameterRun: createParameterRun,
  updateParameterRun: updateParameterRun,
  deleteParameterRun: deleteParameterRun,
  updateAttributeValues: updateAttributeValues,
  createStep: createStep,
  readStep: readStep,
  updateStep: updateStep,
  deleteStep: deleteStep,
  readStepThreads: readStepThreads,
  readSource: readSource,
  readStepParams: readStepParams,
  createStepRun: createStepRun,
  startStepRun: startStepRun,
  endStepRun: endStepRun,
  createForks: createForks,
  getJoinThreads: getJoinThreads,
  syncWorkflow: syncWorkflow,
  syncTask: syncTask,
  createTask: createTask,
  readTask: readTask,
  readTaskVersions: readTaskVersions,
  updateTask: updateTask,
  deleteTask: deleteTask,
  branchWorkflow: branchWorkflow,
  forkWorkflow: forkWorkflow,
  publishWorkflow: publishWorkflow,
  createWorkflow: createWorkflow,
  readWorkflow: readWorkflow,
  updateWorkflow: updateWorkflow,
  deleteWorkflow: deleteWorkflow,
  readWorkflowInputs: readWorkflowInputs,
  readWorkflowVersions: readWorkflowVersions,
  readWorkflowParameters: readWorkflowParameters,
  readEndStep: readEndStep,
  createWorkflowRun: createWorkflowRun,
  updateWorkflowRun: updateWorkflowRun,
  deleteWorkflowRun: deleteWorkflowRun,
  endWorkflowRun: endWorkflowRun
};

var _StepTypeEnum$values$2 = StepTypeEnum.values;
var BASIC$1 = _StepTypeEnum$values$2.BASIC;
var TASK$4 = _StepTypeEnum$values$2.TASK;
var WORKFLOW$4 = _StepTypeEnum$values$2.WORKFLOW;
var _RunStatusEnum$values$2 = RunStatusEnum.values;
var FAIL = _RunStatusEnum$values$2.FAIL;
var SUCCESS = _RunStatusEnum$values$2.SUCCESS;
var JOINED$1 = _RunStatusEnum$values$2.JOINED;


function computeWorkflowStatus(payload, done) {
  var _this = this;

  var workflowRun = payload.workflowRun;
  var thread = payload.thread;
  var step = payload.step;
  var failsWorkflow = step.failsWorkflow;
  var success = step.success;


  this.log.trace({ workflowRun: workflowRun }, 'attempting to complete workflow run computation');

  return this.lib.S2FWorkflow('{\n    readWorkflowRun (id: "' + workflowRun + '") {\n      context {\n        parameter { name },\n        value\n      },\n      threads {\n        stepRuns {\n          step { type, failsWorkflow }\n          status\n        }\n      }\n    }\n  }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;
      var localCtx = {};
      var threads = _.get(data, 'readWorkflowRun[0].threads');
      if (!threads) throw new Error('No threads found');

      // get the local context
      _.forEach(_.get(data, 'readWorkflowRun[0].context'), function (ctx) {
        var name = _.get(ctx, 'parameter.name');
        if (name && _.has(ctx, 'value')) localCtx[name] = ctx.value;
      });

      // reduce the step runs to determine the fail status
      var stepRuns = _.reduce(threads, function (left, right) {
        return _.union(left, _.get(right, 'stepRuns', []));
      }, []);

      var success = _.reduce(stepRuns, function (left, stepRun) {
        var failable = _.includes([BASIC$1, TASK$4, WORKFLOW$4], stepRun.type);
        var stepSuccess = !(stepRun.failsWorkflow && failable && stepRun.status !== FAIL);
        return left && stepSuccess;
      }, true);

      var status = success ? SUCCESS : FAIL;

      return _this.lib.S2FWorkflow('mutation Mutation {\n        updateWorkflowRunThread (id: "' + thread + '", status: ' + JOINED$1 + ')\n        { id }\n      }').then(function (result) {
        return gqlResult(_this, result, function (err, data) {
          if (err) throw err;

          _this.log.trace({ workflowRun: workflowRun }, 'joined final thread');

          return _this.lib.S2FWorkflow('mutation Mutation {\n            endWorkflowRun (id: "' + workflowRun + '", status: ' + status + ')\n          }').then(function (result) {
            return gqlResult(_this, result, function (err, data) {
              if (err) throw err;
              _this.log.debug({ workflowRun: workflowRun, success: success }, 'workflow run completed');
              return done(null, status, { context: localCtx });
            });
          });
        });
      });
    });
  }).catch(function (error) {
    _this.log.error({ error: error }, 'failed to compute workflow');
    done(error);
  });
}

var _RunStatusEnum$values$1 = RunStatusEnum.values;
var CREATED$1 = _RunStatusEnum$values$1.CREATED;
var FORKING = _RunStatusEnum$values$1.FORKING;
var JOINING = _RunStatusEnum$values$1.JOINING;
var ENDING = _RunStatusEnum$values$1.ENDING;
var RUNNING$3 = _RunStatusEnum$values$1.RUNNING;
var JOINED = _RunStatusEnum$values$1.JOINED;

var RUNNING_STATES = [CREATED$1, FORKING, JOINING, RUNNING$3];

/*
 * Notes
 *
 * determine if all required threads have been joined
 * if not, set the current thread to joined
 * if so, set the current thread to joined and create a new thread with the
 * join as its first step and then run the next step or end
 *
 */

// TODO: add thread end instead of workflow end
// because currently failing steps will go to the workflow end
// and cause any joins that steps path might terminate at to never complete
// instead fails should go to the last step in their thread

function joinThreads(payload, done) {
  var workflowRun = payload.workflowRun;
  var thread = payload.thread;


  done();
}

/*
need

steps that should be joined
current state of appropriate threads


 */

var RUNNING$2 = RunStatusEnum.values.RUNNING;
var JOIN$1 = StepTypeEnum.values.JOIN;


function nextStepRun(payload, done) {
  var _this = this;

  var thread = payload.thread;
  var nextStep = payload.nextStep;
  var async = payload.async;
  var workflowRun = payload.workflowRun;


  var event = _.get(this, 'server._emitter');
  if (!event && !async) return done(new Error('No event emitter'));

  return this.lib.S2FWorkflow('{ readStep (id: "' + nextStep + '") { type } }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) {
        console.log(chalk.red(err));
        throw err;
      }
      var type = _.get(data, 'readStep[0].type');

      if (!type) throw new Error('failed to get next step type');

      // if the type is join, call the join threads handler to avoid creating multiple
      // join steps when only one should be created on a new thread
      if (type === JOIN$1) return joinThreads.call(_this, payload, done);

      // otherwise create the next step run
      return _this.lib.S2FWorkflow('mutation Mutation {\n          createStepRun (step: "' + nextStep + '", workflowRunThread: "' + thread + '"),\n          { id }\n        }').then(function (result) {
        return gqlResult(_this, result, function (err, data) {
          if (err) throw err;
          var stepRunId = _.get(data, 'createStepRun.id');
          if (!stepRunId) throw new Error('Unable to create StepRun');

          return _this.lib.S2FWorkflow('mutation Mutation {\n              updateWorkflowRunThread (id: "' + thread + '", currentStepRun: "' + stepRunId + '", status: ' + RUNNING$2 + ')\n              { id }\n            }').then(function (result) {
            return gqlResult(_this, result, function (err, data) {
              if (err) throw err;

              event.emit('schedule', {
                payload: {
                  action: 'runStep',
                  context: { thread: thread, workflowRun: workflowRun }
                }
              });
              return async ? true : done();
            });
          });
        });
      });
    });
  });
}

function setStepStatus(stepRunId, status) {
  var _this = this;

  return this.lib.S2FWorkflow('mutation Mutation { endStepRun (id: "' + stepRunId + '", status: ' + status + ') }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;
      return data;
    });
  });
}

var _RunStatusEnum$values$4 = RunStatusEnum.values;
var CREATED$2 = _RunStatusEnum$values$4.CREATED;
var FORKING$1 = _RunStatusEnum$values$4.FORKING;
var JOINING$1 = _RunStatusEnum$values$4.JOINING;
var ENDING$1 = _RunStatusEnum$values$4.ENDING;
var RUNNING$4 = _RunStatusEnum$values$4.RUNNING;
var JOINED$2 = _RunStatusEnum$values$4.JOINED;

var RUNNING_STATES$1 = [CREATED$2, FORKING$1, JOINING$1, RUNNING$4];

function endWorkflow(payload, done) {
  var _this = this;

  var workflowRun = payload.workflowRun;
  var thread = payload.thread;


  return this.lib.S2FWorkflow('mutation Mutation {\n    updateWorkflowRunThread (id: "' + thread + '", status: ' + ENDING$1 + ')\n    { id }\n  }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;

      return _this.lib.S2FWorkflow('{ readWorkflowRun (id: "' + workflowRun + '") { threads { id, status } } }').then(function (result) {
        return gqlResult(_this, result, function (err, data) {
          if (err) throw err;

          var ending = [];
          var running = [];

          _.forEach(_.get(data, 'readWorkflowRun[0].threads'), function (t) {
            if (_.includes(RUNNING_STATES$1, t.status)) running.push(t.id);else if (t.status === ENDING$1) ending.push(t.id);
          });

          // determine if the current call should complete the workflow
          // if there are no running threads and this thread is the only ending thread
          // then it is ok, otherwise if there are multiple ending then a tiebreaker should
          // take place. the tie breaker will be the sorted order of ids.
          if (running.length || !winTieBreak(thread, ending)) {
            return _this.lib.S2FWorkflow('mutation Mutation {\n              updateWorkflowRunThread (id: "' + thread + '", status: ' + JOINED$2 + ')\n              { id }\n            }').then(function (result) {
              return gqlResult(_this, result, function (err, data) {
                if (err) throw err;
                return done();
              });
            });
          }

          // compute end of workflow
          return computeWorkflowStatus.call(_this, payload, done);
        });
      });
    });
  }).catch(function (error) {
    _this.log.error({ error: error, thread: thread, workflowRun: workflowRun }, 'failed to end workflow or thread');
    done(error);
  });
}

var _RunStatusEnum$values$3 = RunStatusEnum.values;
var SUCCESS$1 = _RunStatusEnum$values$3.SUCCESS;
var FAIL$1 = _RunStatusEnum$values$3.FAIL;
var _ParameterClassEnum$v$2 = ParameterClassEnum.values;
var OUTPUT$1 = _ParameterClassEnum$v$2.OUTPUT;
var ATTRIBUTE$2 = _ParameterClassEnum$v$2.ATTRIBUTE;
var _StepTypeEnum$values$3 = StepTypeEnum.values;
var CONDITION$1 = _StepTypeEnum$values$3.CONDITION;
var LOOP$2 = _StepTypeEnum$values$3.LOOP;


function handleContext(payload, done) {
  var _this = this;

  return function (ctx) {
    var runner = payload.runner;
    var workflowRun = payload.workflowRun;
    var thread = payload.thread;
    var endStep = payload.endStep;
    var localCtx = payload.localCtx;
    var context = payload.context;
    var args = payload.args;
    var step = payload.step;
    var stepRunId = payload.stepRunId;
    var async = step.async;
    var source = step.source;
    var timeout = step.timeout;
    var failsWorkflow = step.failsWorkflow;
    var waitOnSuccess = step.waitOnSuccess;
    var success = step.success;
    var fail = step.fail;
    var parameters = step.parameters;

    fail = fail || endStep;

    var failed = ctx._exception || ctx._result === false;
    var nextStep = failed ? fail : success;
    var status = failed ? FAIL$1 : SUCCESS$1;

    switch (step.type) {
      case CONDITION$1:
        status = SUCCESS$1;
        break;
      case LOOP$2:
        status = SUCCESS$1;
        break;
      default:
        break;
    }

    // generate value changes to push
    var outputs = [];
    _.forEach(parameters, function (param) {
      if (param.class === OUTPUT$1 && _.has(ctx, param.name) && _.has(param, 'mapsTo')) {
        try {
          var target = _.find(context, { parameter: { id: param.mapsTo, class: ATTRIBUTE$2 } });
          if (!target) return;

          outputs.push({
            id: target.id,
            value: convertType(param.type, param.name, _.get(ctx, param.name))
          });
        } catch (error) {
          _this.log.warn({ error: error }, 'type conversion failed so value will not be set');
        }
      }
    });

    return _this.lib.S2FWorkflow('mutation Mutation {\n      updateAttributeValues (values: ' + obj2arg(outputs) + ')\n    }').then(function () {
      return setStepStatus.call(_this, stepRunId, status).then(function () {
        if (nextStep === endStep) return endWorkflow.call(_this, payload, done);else if (!async) return nextStepRun.call(_this, { thread: thread, workflowRun: workflowRun, nextStep: nextStep, async: async }, done);
        done();
      });
    });
  };
}

var RUNNING$1 = RunStatusEnum.values.RUNNING;
var LOOP$1 = StepTypeEnum.values.LOOP;

// basic source run

function basicRun(runOpts) {
  var source = runOpts.source;
  var context = runOpts.context;
  var timeout = runOpts.timeout;
  var payload = runOpts.payload;
  var done = runOpts.done;

  return sbx.vm(source, _.merge({ context: context, timeout: timeout }, _.get(this.options, 'vm', {}))).then(handleContext.call(this, payload, done));
}

// loop source
function loopRun(runOpts) {
  var _this = this;

  var loop = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var source = runOpts.source;
  var context = runOpts.context;
  var timeout = runOpts.timeout;
  var payload = runOpts.payload;
  var done = runOpts.done;

  context.loop = loop;
  return sbx.vm(source, _.merge({ context: context, timeout: timeout }, _.get(this.options, 'vm', {}))).then(function (ctx) {
    if (ctx._result === false || ctx._exception) return handleContext.call(_this, payload, done)(ctx);
    return loopRun.call(_this, { source: source, context: ctx, timeout: timeout, payload: payload, done: done }, loop++);
  });
}

function runSource(payload, done) {
  var _this2 = this;

  var thread = payload.thread;
  var endStep = payload.endStep;
  var localCtx = payload.localCtx;
  var step = payload.step;
  var workflowRun = payload.workflowRun;
  var async = step.async;
  var source = step.source;
  var timeout = step.timeout;
  var success = step.success;

  if (!source) return done(new Error('No source'));

  return this.lib.S2FWorkflow('mutation Mutation {\n    updateWorkflowRunThread ( id: "' + thread + '", status: ' + RUNNING$1 + ' )\n    { id }\n  }').then(function (result) {
    return gqlResult(_this2, result, function (err, data) {
      if (err) throw err;

      var runOpts = { source: source, context: localCtx, timeout: timeout, payload: payload, done: done };
      var run = step.type === LOOP$1 ? loopRun.call(_this2, runOpts) : basicRun.call(_this2, runOpts);

      // non-async or last step
      if (!async || success === endStep) return run;

      // async - since run has already been called, we just remove the resolve dependency from nextStep
      return nextStepRun.call(_this2, { thread: thread, workflowRun: workflowRun, nextStep: success, async: async }, done);
    });
  }).catch(function (error) {
    done(error);
  });
}

var FORKED$1 = RunStatusEnum.values.FORKED;


function forkSteps(payload, done) {
  var _this = this;

  var workflowRun = payload.workflowRun;
  var thread = payload.thread;
  var stepRunId = payload.stepRunId;
  var id = payload.step.id;

  var event = _.get(this, 'server._emitter');
  if (!event) return done(new Error('No event emitter'));

  return this.lib.S2FWorkflow('mutation Mutation {\n    createForks (step: "' + id + '", workflowRun: "' + workflowRun + '", workflowRunThread: "' + thread + '")\n    { id }\n  }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;

      return setStepStatus.call(_this, stepRunId, FORKED$1).then(function () {
        _.forEach(_.get(data, 'createForks'), function (fork) {
          var thread = fork.id;
          event.emit('schedule', {
            payload: {
              action: 'runStep',
              context: { thread: thread, workflowRun: workflowRun }
            }
          });
        });
        return done();
      });
    });
  }).catch(function (error) {
    _this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed fork step');
    done(error);
  });
}

var RUNNING$5 = RunStatusEnum.values.RUNNING;


function runSubWorkflow(payload, done) {
  var _this = this;

  console.log(chalk.blue('RUNNIN SUBWORKFLOW'));
  var runner = payload.runner;
  var thread = payload.thread;
  var localCtx = payload.localCtx;
  var args = payload.args;
  var step = payload.step;
  var stepRunId = payload.stepRunId;
  var subWorkflow = step.subWorkflow;


  return this.lib.S2FWorkflow('mutation Mutation {\n    updateWorkflowRunThread ( id: "' + thread + '", status: ' + RUNNING$5 + ' )\n    { id }\n  }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;

      console.log(chalk.magenta(JSON.stringify(data, null, '  ')));

      return startWorkflow(_this)(runner, {
        args: {
          recordId: _.get(subWorkflow, '_temporal.recordId'),
          date: args.date,
          version: args.version
        },
        input: localCtx,
        parent: stepRunId
      }, done);
    });
  }).catch(function (error) {
    done(error);
  });
}

var _StepTypes$values = StepTypeEnum.values;
var BASIC = _StepTypes$values.BASIC;
var CONDITION = _StepTypes$values.CONDITION;
var FORK$1 = _StepTypes$values.FORK;
var JOIN = _StepTypes$values.JOIN;
var LOOP = _StepTypes$values.LOOP;
var TASK$3 = _StepTypes$values.TASK;
var WORKFLOW$3 = _StepTypes$values.WORKFLOW;


function runStep(backend) {
  return function (runner, task, done) {
    var _task$context = task.context;
    var workflowRun = _task$context.workflowRun;
    var thread = _task$context.thread;

    var taskId = task.id;

    if (!workflowRun || !thread) return done(new Error('No workflow run or main thread created'));

    return backend.lib.S2FWorkflow('{\n      readWorkflowRun (id: "' + workflowRun + '") {\n        workflow { endStep { id } },\n        args,\n        input,\n        context {\n          id,\n          parameter { id, name, type, scope, class },\n          value\n        },\n        threads (id: "' + thread + '") {\n          currentStepRun {\n            id,\n            step {\n              id,\n              type,\n              async,\n              source,\n              subWorkflow {\n                _temporal { recordId },\n                id\n              },\n              timeout,\n              failsWorkflow,\n              waitOnSuccess,\n              requireResumeKey,\n              success,\n              fail,\n              parameters { id, name, type, scope, class, mapsTo }\n            }\n          }\n        }\n      }\n    }').then(function (result) {
      return gqlResult(backend, result, function (err, data) {
        if (err) throw err;

        var _$get = _.get(data, 'readWorkflowRun[0]', {});

        var endStep = _$get.workflow.endStep;
        var args = _$get.args;
        var input = _$get.input;
        var context = _$get.context;
        var threads = _$get.threads;

        var step = _.get(threads, '[0].currentStepRun.step');
        var stepRunId = _.get(threads, '[0].currentStepRun.id');
        endStep = _.get(endStep, 'id');
        if (!step) return done(new Error('No step found in thread'));
        if (!endStep) return done(new Error('No end step found'));
        backend.log.trace({ step: step.id, type: step.type }, 'Successfully queried step');

        // map all of the parameters
        var localCtx = mapInput(input, context, _.get(step, 'parameters', []));

        // everything is ready to run the task, set the task to running
        return backend.lib.S2FWorkflow('mutation Mutation { startStepRun (id: "' + stepRunId + '") }').then(function () {
          var payload = {
            runner: runner,
            taskId: taskId,
            workflowRun: workflowRun,
            thread: thread,
            endStep: endStep,
            localCtx: localCtx,
            context: context,
            args: args,
            step: step,
            stepRunId: stepRunId
          };

          switch (step.type) {
            case BASIC:
              return runSource.call(backend, payload, done);
            case TASK$3:
              return runSource.call(backend, payload, done);
            case LOOP:
              return runSource.call(backend, payload, done);
            case CONDITION:
              return runSource.call(backend, payload, done);
            case JOIN:
              return joinThreads.call(backend, payload, done);
            case WORKFLOW$3:
              return runSubWorkflow.call(backend, payload, done);
            case FORK$1:
              return forkSteps.call(backend, payload, done);
            default:
              return done(new Error('Invalid step type or action cannot be performed on type'));
          }
        });
      });
    }).catch(function (error) {
      backend.log.error({
        errors: error.message || error,
        stack: error.stack
      }, 'Failed to start step');
      return done(error);
    });
  };
}

function createWorkflowRun$1(runner, context, done, wf) {
  var _this = this;

  var id = context.id;
  var args = context.args;
  var input = context.input;
  var parent = context.parent;

  var step = wf.steps[0];

  // convert enums
  step.type = 'Enum::' + step.type;
  _.forEach(step.parameters, function (param) {
    param.class = 'Enum::' + param.class;
    param.type = 'Enum::' + param.type;
  });
  _.forEach(wf.parameters, function (param) {
    param.class = 'Enum::' + param.class;
    param.type = 'Enum::' + param.type;
  });

  var params = {
    workflow: wf.id,
    args: args,
    input: input,
    parameters: wf.parameters,
    step: step
  };

  if (parent) params.parent = parent;

  return this.lib.S2FWorkflow('mutation Mutation {\n    createWorkflowRun (' + obj2arg(params, { noOuterBraces: true }) + ') {\n      id,\n      threads { id }\n    }\n  }').then(function (result) {
    return gqlResult(_this, result, function (err, data) {
      if (err) throw err;
      var workflowRun = _.get(data, 'createWorkflowRun.id');
      var thread = _.get(data, 'createWorkflowRun.threads[0].id');
      return runStep(_this)(runner, { id: id, context: { workflowRun: workflowRun, thread: thread } }, done);
    });
  }).catch(function (err) {
    return done(err);
  });
}

function startWorkflow(backend) {
  return function (runner, task, done) {
    var id = task.id;
    var _task$context = task.context;
    var args = _task$context.args;
    var input = _task$context.input;
    var parent = _task$context.parent;

    input = input || {};
    if (!args) return done(new Error('No context was supplied'));

    console.log(chalk.cyan('==========================='));
    console.log(chalk.cyan(JSON.stringify(context, null, '  ')));
    console.log(chalk.cyan('==========================='));

    return backend.lib.S2FWorkflow('{\n      readWorkflow (' + obj2arg(args, { noOuterBraces: true }) + ') {\n        _temporal { recordId },\n        id,\n        name,\n        inputs { id, name, type, class, required, defaultValue },\n        parameters { id, name, class, type, required, defaultValue },\n        steps (first: true) {\n          id,\n          name,\n          type,\n          async,\n          source,\n          subWorkflow {\n            _temporal { recordId },\n            id\n          },\n          timeout,\n          failsWorkflow,\n          waitOnSuccess,\n          requireResumeKey,\n          success,\n          fail,\n          parameters { id, name, type, class, required, mapsTo, defaultValue }\n        }\n      }\n    }', {}, args).then(function (result) {
      return gqlResult(backend, result, function (err, data) {
        var wf = _.get(data, 'readWorkflow[0]');
        var step = _.get(wf, 'steps[0]');
        if (err) throw err;
        if (!wf) throw new Error('No workflow found');
        if (!step || step.type === 'END') throw new Error('The workflow contains no valid steps');

        backend.log.trace({ server: backend._server, workflow: wf.id }, 'Successfully queried workflow');

        // check that all required inputs are provided and that the types are correct
        // also convert them at this time
        // using a for loop to allow thrown errors to be caught by promise catch
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = wf.inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            if (i.required && !_.has(input, i.name)) throw new Error('missing required input ' + i.name);
            if (_.has(input, i.name)) input[i.name] = convertType(i.type, i.name, input[i.name]);
          }

          // run the
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return createWorkflowRun$1.call(backend, runner, { id: id, args: args, input: input, parent: parent }, done, wf);
      });
    }).catch(function (err) {
      console.log(err);
      backend.log.error({
        errors: err.message || err,
        stack: err.stack
      }, 'Failed to start workflow');
      return done(err);
    });
  };
}

function actions (backend) {
  return {
    startWorkflow: startWorkflow(backend),
    runStep: runStep(backend)
  };
}

var Task$2 = [{
  _temporal: {
    changeLog: [{
      date: new Date(1473606625377),
      message: 'Publish',
      type: 'PUBLISH',
      user: 'SYSTEM'
    }],
    recordId: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
    validFrom: new Date(1473606625377),
    validTo: null,
    version: '0.1.0'
  },
  entityType: 'TASK',
  id: '0ea85a8a-ba97-4c31-8ed0-37926989b384',
  name: 'Say Hello',
  source: 'console.log("Hello", name)'
}, {
  _temporal: {
    recordId: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
    validFrom: null,
    validTo: null,
    version: null
  },
  entityType: 'TASK',
  id: 'b98548c6-d294-4406-88c1-3d7cffb97cfa',
  name: 'Say Hello',
  source: 'console.log("Hi", name)'
}];

var Parameter$2 = [{
  entityType: 'PARAMETER',
  id: '0a329a80-3b97-4b83-832f-7f9c960afdfc',
  name: 'name',
  parentId: '0ea85a8a-ba97-4c31-8ed0-37926989b384',
  required: 'false',
  scope: 'TASK',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: 'fed6aa1e-5a25-4cd6-8b35-20ad0e6547df',
  name: 'name',
  parentId: 'b98548c6-d294-4406-88c1-3d7cffb97cfa',
  required: 'false',
  scope: 'TASK',
  class: 'INPUT',
  type: 'STRING'
}];

var SayHello = { Task: Task$2, Parameter: Parameter$2 };

var tasks = [SayHello];

var Workflow$2 = [{
  _temporal: {
    changeLog: [],
    recordId: '72264666-5e7b-4bd7-b6f6-efff3a5aa73c',
    validFrom: null,
    validTo: null,
    version: null
  },
  entityType: 'WORKFLOW',
  id: '170ab3d5-4ff4-41ed-b875-010067d1ebc5',
  name: 'Fork Join Test',
  endStep: '44dad1a6-31d6-4d9b-9106-b80d05823195'
}];

var Step$2 = [{
  _temporal: {
    changeLog: [],
    recordId: 'f32485c9-3087-43bc-9565-55a594fe9224',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Ending point of the workflow',
  entityType: 'STEP',
  fail: '44dad1a6-31d6-4d9b-9106-b80d05823195',
  failsWorkflow: false,
  id: '44dad1a6-31d6-4d9b-9106-b80d05823195',
  name: 'End',
  requireResumeKey: false,
  success: '44dad1a6-31d6-4d9b-9106-b80d05823195',
  timeout: 0,
  type: 'END',
  waitOnSuccess: false,
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'f1b70a2c-e583-4fcb-abf0-ae01621678c5',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: 'b6a0edaa-2417-4e75-8083-c62250dae391',
  name: 'Fork',
  requireResumeKey: false,
  timeout: 0,
  type: 'FORK',
  waitOnSuccess: false,
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'e432ac48-6f52-4776-8c20-842246fe54f9',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: true,
  entityType: "STEP",
  failsWorkflow: false,
  id: '80c73966-aac8-4f7b-b889-e64363322b4b',
  name: 'Fork Left',
  source: 'console.log("===========");\nconsole.log("=========== Forking Left", name);\nconsole.log("===========")',
  requireResumeKey: false,
  success: '453721c9-9347-4d22-a07f-b85630954835',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  fork: 'b6a0edaa-2417-4e75-8083-c62250dae391',
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: '2108ead8-917f-43ef-ba2a-0d074bb300bd',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '453721c9-9347-4d22-a07f-b85630954835',
  name: 'After Fork Left',
  source: 'console.log("===========");\nconsole.log("=========== After Fork Left");\nconsole.log("===========")',
  requireResumeKey: false,
  success: 'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: '86393566-88b7-4971-97bf-6f60ea8df80c',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '3e5d2306-d12d-48f9-a9ee-a4b53acc753b',
  name: 'Fork Right',
  source: 'console.log("===========");\nconsole.log("=========== Forking Right");\nconsole.log("===========")',
  requireResumeKey: false,
  success: 'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  fork: 'b6a0edaa-2417-4e75-8083-c62250dae391',
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: '75c03bdd-ec3d-49ad-9ecb-207e9b511869',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: 'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
  name: 'Join',
  requireResumeKey: false,
  timeout: 0,
  type: 'JOIN',
  success: '44dad1a6-31d6-4d9b-9106-b80d05823195',
  waitOnSuccess: false,
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}, {
  _temporal: {
    changeLog: [],
    recordId: '7af16dd4-346a-4527-b9d4-b58d31017c4d',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Starting point of the workflow',
  entityType: 'STEP',
  fail: '44dad1a6-31d6-4d9b-9106-b80d05823195',
  failsWorkflow: false,
  id: '1cb92ccb-e022-4b43-aa29-8e37492b021e',
  name: 'Start',
  requireResumeKey: false,
  success: 'b6a0edaa-2417-4e75-8083-c62250dae391',
  timeout: 0,
  type: 'START',
  waitOnSuccess: false,
  workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
}];

var Parameter$3 = [{
  entityType: 'PARAMETER',
  id: 'c9cf9ca4-4053-4c32-b052-ad79f262df27',
  name: 'name',
  parentId: '80c73966-aac8-4f7b-b889-e64363322b4b',
  required: 'false',
  scope: 'STEP',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '4686b2eb-7815-4bad-a941-dcbd36f1fba7',
  name: 'name',
  parentId: '80c73966-aac8-4f7b-b889-e64363322b4b',
  required: 'false',
  scope: 'STEP',
  mapsTo: '9bbf9716-f6eb-4dd5-a9c5-b44fb29f93d0',
  class: 'OUTPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '9bbf9716-f6eb-4dd5-a9c5-b44fb29f93d0',
  name: 'message',
  defaultValue: 'Hello',
  parentId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5',
  required: 'false',
  scope: 'WORKFLOW',
  class: 'ATTRIBUTE',
  type: 'STRING'
}];

var ForkJoinTest = {
  Workflow: Workflow$2,
  Step: Step$2,
  Parameter: Parameter$3
};

var Workflow$3 = [{
  _temporal: {
    changeLog: [],
    recordId: '151743c4-93ee-48ab-a7d3-608a5d06900e',
    validFrom: null,
    validTo: null,
    version: null
  },
  entityType: 'WORKFLOW',
  id: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a',
  name: 'Fork Test',
  endStep: 'c6c463db-68bf-4e6f-aeaa-c546dae14525'
}];

var Step$3 = [{
  _temporal: {
    changeLog: [],
    recordId: '17bbc6b5-00c8-4aab-a9ca-05cdd38ab1ae',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Ending point of the workflow',
  entityType: 'STEP',
  fail: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  failsWorkflow: false,
  id: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  name: 'End',
  requireResumeKey: false,
  success: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  timeout: 0,
  type: 'END',
  waitOnSuccess: false,
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}, {
  _temporal: {
    changeLog: [],
    recordId: '31f7d5cf-4799-4029-a4b8-45be79f33e3f',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
  name: 'Fork',
  requireResumeKey: false,
  timeout: 0,
  type: 'FORK',
  waitOnSuccess: false,
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'c9c1531e-ef6d-4199-b559-796fd144d983',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: true,
  entityType: "STEP",
  failsWorkflow: false,
  id: '9417a242-0f72-4ef7-b876-61efb23ad446',
  name: 'Fork Left',
  source: 'console.log("===========");\nconsole.log("=========== Forking Left", name);\nconsole.log("===========")',
  requireResumeKey: false,
  success: 'aff95d33-9f8a-4ece-87f7-462d1b71eeb9',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  fork: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'bbfe82e3-6ee6-4001-8ea6-2b00d932f2d3',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: 'aff95d33-9f8a-4ece-87f7-462d1b71eeb9',
  name: 'After Fork Left',
  source: 'console.log("===========");\nconsole.log("=========== After Fork Left");\nconsole.log("===========")',
  requireResumeKey: false,
  success: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}, {
  _temporal: {
    changeLog: [],
    recordId: '2a7f16df-3c7f-46ab-bdf9-9314a46c0c29',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '44580253-4216-4fe1-9333-dcef4927280f',
  name: 'Fork Right',
  source: 'console.log("===========");\nconsole.log("=========== Forking Right");\nconsole.log("===========")',
  requireResumeKey: false,
  success: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  fork: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'ceff4a5d-3f73-4c63-8ba2-5fef6d65be28',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Starting point of the workflow',
  entityType: 'STEP',
  fail: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
  failsWorkflow: false,
  id: '3347466a-3abf-42c6-9fd7-3ddf22976af8',
  name: 'Start',
  requireResumeKey: false,
  success: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
  timeout: 0,
  type: 'START',
  waitOnSuccess: false,
  workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
}];

var Parameter$4 = [{
  entityType: 'PARAMETER',
  id: '912f5d3b-9d4f-4fe5-93f1-a6446b983ed5',
  name: 'name',
  parentId: '9417a242-0f72-4ef7-b876-61efb23ad446',
  required: 'false',
  scope: 'STEP',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '3361dde6-3db4-4a4e-8b4f-58d7f8fd2a90',
  name: 'name',
  parentId: '9417a242-0f72-4ef7-b876-61efb23ad446',
  required: 'false',
  scope: 'STEP',
  mapsTo: '93f439a5-9833-4706-9cd8-7acf19b01901',
  class: 'OUTPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '93f439a5-9833-4706-9cd8-7acf19b01901',
  name: 'message',
  defaultValue: 'Hello',
  parentId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a',
  required: 'false',
  scope: 'WORKFLOW',
  class: 'ATTRIBUTE',
  type: 'STRING'
}];

var ForkTest = {
  Workflow: Workflow$3,
  Step: Step$3,
  Parameter: Parameter$4
};

var Workflow$4 = [{
  _temporal: {
    changeLog: [],
    recordId: 'c5801b61-a7cd-4995-964b-c0a1f368de7c',
    validFrom: null,
    validTo: null,
    version: null
  },
  entityType: 'WORKFLOW',
  id: 'f4a8f894-06ba-4213-80f1-80ff72e1039b',
  name: 'Hello World',
  endStep: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'c5801b61-a7cd-4995-964b-c0a1f368de7c',
    validFrom: new Date('2016-01-01'),
    validTo: null,
    version: '0.1.0'
  },
  entityType: 'WORKFLOW',
  id: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8',
  name: 'Hello World',
  endStep: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb'
}];

var Step$4 = [{
  _temporal: {
    changeLog: [],
    recordId: '2f703d65-3aa7-40fc-b99d-3a0610ee6645',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Ending point of the workflow',
  entityType: 'STEP',
  fail: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
  failsWorkflow: false,
  id: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
  name: 'End',
  requireResumeKey: false,
  success: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
  timeout: 0,
  type: 'END',
  waitOnSuccess: false,
  workflowId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'e86715f1-11a4-402c-9aa3-1b7c61a4af8c',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '68e5264a-89ef-4c85-9235-09d8e944580f',
  name: 'Say Hello',
  requireResumeKey: false,
  task: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
  versionArgs: {},
  success: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
  timeout: 0,
  type: 'TASK',
  waitOnSuccess: false,
  workflowId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
}, {
  _temporal: {
    changeLog: [],
    recordId: '19a1e436-3532-4f51-8508-868d4f234bd2',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Starting point of the workflow',
  entityType: 'STEP',
  fail: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
  failsWorkflow: false,
  id: '93a66216-21f5-45b5-92ae-f200a23c5c82',
  name: 'Start',
  requireResumeKey: false,
  success: '68e5264a-89ef-4c85-9235-09d8e944580f',
  timeout: 0,
  type: 'START',
  waitOnSuccess: false,
  workflowId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'b0199df1-50be-4958-9e51-39104ead1bee',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Ending point of the workflow',
  entityType: 'STEP',
  fail: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
  failsWorkflow: false,
  id: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
  name: 'End',
  requireResumeKey: false,
  success: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
  timeout: 0,
  type: 'END',
  waitOnSuccess: false,
  workflowId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'cc76353e-5de4-44e8-8523-fd64f5a9149c',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: 'f8904d60-a73c-4348-867a-6d5df19bf6cc',
  name: 'Say Hello',
  requireResumeKey: false,
  task: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
  versionArgs: {},
  success: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
  timeout: 0,
  type: 'TASK',
  waitOnSuccess: false,
  workflowId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8'
}, {
  _temporal: {
    changeLog: [],
    recordId: '758c4bea-0fc0-4f61-888c-7ef45d8fef35',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Starting point of the workflow',
  entityType: 'STEP',
  fail: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
  failsWorkflow: false,
  id: '85a7ba22-4d74-41e1-b291-c82f69d15456',
  name: 'Start',
  requireResumeKey: false,
  success: 'f8904d60-a73c-4348-867a-6d5df19bf6cc',
  timeout: 0,
  type: 'START',
  waitOnSuccess: false,
  workflowId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8'
}];

var Parameter$5 = [{
  entityType: 'PARAMETER',
  id: 'a2189572-dce9-46b8-897f-18d5bb221c08',
  name: 'name',
  parentId: '68e5264a-89ef-4c85-9235-09d8e944580f',
  required: 'false',
  scope: 'STEP',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '1e5782b6-e8c0-47c0-b4bc-a0eca56805c1',
  name: 'message',
  defaultValue: 'Hello',
  parentId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b',
  required: 'false',
  scope: 'WORKFLOW',
  class: 'ATTRIBUTE',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '97eacabd-6dbd-42fa-b6c4-3e8c49cde118',
  name: 'name',
  parentId: 'f8904d60-a73c-4348-867a-6d5df19bf6cc',
  required: 'false',
  scope: 'STEP',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: 'd01a6dad-9a0a-4eb5-abf6-04a212eda686',
  name: 'message',
  defaultValue: 'Hello',
  parentId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8',
  required: 'false',
  scope: 'WORKFLOW',
  class: 'ATTRIBUTE',
  type: 'STRING'
}];

var HelloWorld = {
  Workflow: Workflow$4,
  Step: Step$4,
  Parameter: Parameter$5
};

var Workflow$5 = [{
  _temporal: {
    changeLog: [],
    recordId: '2464780a-92ba-475b-b7a6-c49a0a9d189b',
    validFrom: null,
    validTo: null,
    version: null
  },
  entityType: 'WORKFLOW',
  id: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff',
  name: 'Sub Workflow Test',
  endStep: 'c3dd216f-aa42-472d-806e-7beaf48609ed'
}];

var Step$5 = [{
  _temporal: {
    changeLog: [],
    recordId: '9231a271-0f03-418d-ac9c-faa46c59506e',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Starting point of the workflow',
  entityType: 'STEP',
  fail: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
  failsWorkflow: false,
  id: '68084694-e75a-45ab-816e-615c3c606596',
  name: 'Start',
  requireResumeKey: false,
  success: '6cb7a7e5-1c6c-468e-8106-29abeb585844',
  timeout: 0,
  type: 'START',
  waitOnSuccess: false,
  workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
}, {
  _temporal: {
    changeLog: [],
    recordId: 'a0c84a22-4bde-4ee7-abc9-f098b082bef0',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '6cb7a7e5-1c6c-468e-8106-29abeb585844',
  name: 'Test Name',
  source: 'console.log("===========");\nconsole.log("Sub Workflow Start");\nconsole.log("===========");',
  requireResumeKey: false,
  task: '5ca86058-4b93-4feb-8136-554195516cd1',
  success: '845a78a5-a2fa-422c-9cd5-806004be0038',
  timeout: 0,
  type: 'BASIC',
  waitOnSuccess: false,
  workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
}, {
  _temporal: {
    changeLog: [],
    recordId: '4fb2fdd9-8698-4f97-ad37-19bfe9f05bad',
    validFrom: null,
    validTo: null,
    version: null
  },
  async: false,
  entityType: "STEP",
  failsWorkflow: false,
  id: '845a78a5-a2fa-422c-9cd5-806004be0038',
  name: 'Hello World',
  requireResumeKey: false,
  subWorkflow: 'c5801b61-a7cd-4995-964b-c0a1f368de7c',
  success: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
  timeout: 0,
  type: 'WORKFLOW',
  waitOnSuccess: false,
  workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
}, {
  _temporal: {
    changeLog: [],
    recordId: '94aa101f-4a8a-47a8-aae2-699cfeba541c',
    validFrom: null,
    validTo: null,
    version: null
  },
  description: 'Ending point of the workflow',
  entityType: 'STEP',
  fail: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
  failsWorkflow: false,
  id: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
  name: 'End',
  requireResumeKey: false,
  success: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
  timeout: 0,
  type: 'END',
  waitOnSuccess: false,
  workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
}];

var Parameter$6 = [{
  entityType: 'PARAMETER',
  id: '1cf60c78-bfc9-4845-985c-343923f8c1d1',
  name: 'name',
  parentId: '6cb7a7e5-1c6c-468e-8106-29abeb585844',
  required: 'false',
  scope: 'STEP',
  class: 'INPUT',
  type: 'STRING'
}, {
  entityType: 'PARAMETER',
  id: '3fc2c440-5c1e-442f-9bfd-2250f88b2f0b',
  name: 'message',
  defaultValue: 'Hello',
  parentId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff',
  required: 'false',
  scope: 'WORKFLOW',
  class: 'ATTRIBUTE',
  type: 'STRING'
}];

var SubWorkflowTest = {
  Workflow: Workflow$5,
  Step: Step$5,
  Parameter: Parameter$6
};

var workflows = [ForkJoinTest, ForkTest, HelloWorld, SubWorkflowTest];

var Workflow$1 = [];
var Step$1 = [];
var Parameter$1 = [];
var Task$1 = [];

var Folder$1 = [{
  id: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
  entityType: 'FOLDER',
  name: 'Workflows',
  parent: 'ROOT',
  type: 'WORKFLOW'
}, {
  id: '4acb1f18-2935-4708-8d3c-69c7209f8d87',
  entityType: 'FOLDER',
  name: 'Tasks',
  parent: 'ROOT',
  type: 'TASK'
}, {
  id: '9595014b-5614-4475-8e0e-4d07e4e865b6',
  entityType: 'FOLDER',
  name: 'Examples',
  parent: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
  type: 'WORKFLOW'
}, {
  id: '067c20db-c009-4277-aeda-e3db9af31472',
  entityType: 'FOLDER',
  name: 'Examples',
  parent: '4acb1f18-2935-4708-8d3c-69c7209f8d87',
  type: 'TASK'
}];

var FolderMembership$1 = [{
  folder: '067c20db-c009-4277-aeda-e3db9af31472',
  childType: 'TASK',
  childId: '4c35b5a7-e971-4719-9846-ca06db2f8eb2'
}, {
  folder: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
  childType: 'WORKFLOW',
  childId: '72264666-5e7b-4bd7-b6f6-efff3a5aa73c'
}, {
  folder: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
  childType: 'WORKFLOW',
  childId: '151743c4-93ee-48ab-a7d3-608a5d06900e'
}, {
  folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
  childType: 'WORKFLOW',
  childId: 'c5801b61-a7cd-4995-964b-c0a1f368de7c'
}, {
  folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
  childType: 'WORKFLOW',
  childId: '2464780a-92ba-475b-b7a6-c49a0a9d189b'
}];

// merge all the workflows
_.forEach(_.union(workflows, tasks), function (def) {
  if (_.isArray(def.Workflow)) Workflow$1 = _.union(Workflow$1, def.Workflow);
  if (_.isArray(def.Step)) Step$1 = _.union(Step$1, def.Step);
  if (_.isArray(def.Parameter)) Parameter$1 = _.union(Parameter$1, def.Parameter);
  if (_.isArray(def.Task)) Task$1 = _.union(Task$1, def.Task);
});

var installData = { Workflow: Workflow$1, Step: Step$1, Parameter: Parameter$1, Task: Task$1, Folder: Folder$1, FolderMembership: FolderMembership$1 };

var S2fRethinkDBBackend = function (_YellowjacketRethinkD) {
  inherits(S2fRethinkDBBackend, _YellowjacketRethinkD);

  function S2fRethinkDBBackend(namespace, graphql, r) {
    var config = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    var connection = arguments[4];
    classCallCheck(this, S2fRethinkDBBackend);

    config = mergeConfig(config);

    // create a temporal plugin
    var temporalOptions = {
      tables: temporalTables(config.types),
      prefix: _.get(config, 'options.prefix'),
      db: _.get(config, 'options.store')
    };
    var temporalBackend = new graphqlFactoryTemporal_backend.rethinkdb(r, graphql, temporalOptions, connection);
    var temporalPlugin = FactoryTemporalPlugin(temporalBackend);

    // merge plugins
    config.plugin = _.union([temporalPlugin], _.isArray(config.plugin) ? config.plugin : []);

    var _this = possibleConstructorReturn(this, (S2fRethinkDBBackend.__proto__ || Object.getPrototypeOf(S2fRethinkDBBackend)).call(this, namespace, graphql, r, config, connection));

    _this.type = 'S2fRethinkDBBackend';

    // add data
    _this.addInstallData(installData);

    // add functions
    _this.addFunctions(functions);

    // add actions
    _this.addActions(actions(_this));

    // add events
    _this.addEvents(events);
    return _this;
  }

  return S2fRethinkDBBackend;
}(yellowjacket.YellowjacketRethinkDBBackend);

// helper function to instantiate a new backend
function rethinkdb$1 (namespace, graphql, r, config, connection) {
  return new S2fRethinkDBBackend(namespace, graphql, r, config, connection);
}

var index = {
  rethinkdb: rethinkdb$1,
  S2fRethinkDBBackend: S2fRethinkDBBackend
};

exports.rethinkdb = rethinkdb$1;
exports.S2fRethinkDBBackend = S2fRethinkDBBackend;
exports['default'] = index;