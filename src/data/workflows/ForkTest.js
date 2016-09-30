export const Workflow = [
  {
    _temporal: {
      changeLog: [],
      recordId: '151743c4-93ee-48ab-a7d3-608a5d06900e',
      validFrom: null,
      validTo: null,
      version: null
    },
    entityType: 'WORKFLOW',
    id:  'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a',
    name:  'Fork Test',
    endStep: 'c6c463db-68bf-4e6f-aeaa-c546dae14525'
  }
]

export const Step = [
  {
    _temporal: {
      changeLog: [],
      recordId: '17bbc6b5-00c8-4aab-a9ca-05cdd38ab1ae',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  '31f7d5cf-4799-4029-a4b8-45be79f33e3f',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
    name:  'Fork',
    requireResumeKey: false,
    timeout: 0,
    type: 'FORK',
    waitOnSuccess: false,
    workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'c9c1531e-ef6d-4199-b559-796fd144d983',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '9417a242-0f72-4ef7-b876-61efb23ad446',
    name:  'Fork Left',
    source:  'console.log("Forking Left", name)',
    requireResumeKey: false,
    success: 'aff95d33-9f8a-4ece-87f7-462d1b71eeb9',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    fork: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
    workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
  },

  {
    _temporal: {
      changeLog: [],
      recordId:  'bbfe82e3-6ee6-4001-8ea6-2b00d932f2d3',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  'aff95d33-9f8a-4ece-87f7-462d1b71eeb9',
    name:  'After Fork Left',
    source:  'console.log("After Fork Left")',
    requireResumeKey: false,
    success: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
  },

  {
    _temporal: {
      changeLog: [],
      recordId:  '2a7f16df-3c7f-46ab-bdf9-9314a46c0c29',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '44580253-4216-4fe1-9333-dcef4927280f',
    name:  'Fork Right',
    source:  'console.log("Forking Right")',
    requireResumeKey: false,
    success: 'c6c463db-68bf-4e6f-aeaa-c546dae14525',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    fork: '4cc47451-7115-49b5-ace2-4d05fc3ad09c',
    workflowId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a'
  },
  {
    _temporal: {
      changeLog: [],
      recordId: 'ceff4a5d-3f73-4c63-8ba2-5fef6d65be28',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  }
]

export const Parameter = [
  {
    entityType: 'PARAMETER',
    id: '912f5d3b-9d4f-4fe5-93f1-a6446b983ed5',
    name: 'name',
    parentId: '9417a242-0f72-4ef7-b876-61efb23ad446',
    required: 'false',
    scope: 'STEP',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '3361dde6-3db4-4a4e-8b4f-58d7f8fd2a90',
    name: 'name',
    parentId: '9417a242-0f72-4ef7-b876-61efb23ad446',
    required: 'false',
    scope: 'STEP',
    mapsTo: '93f439a5-9833-4706-9cd8-7acf19b01901',
    class: 'OUTPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '93f439a5-9833-4706-9cd8-7acf19b01901',
    name: 'message',
    defaultValue: 'Hello',
    parentId: 'dd64cdb7-d089-48e0-8994-33dbc9ed6c4a',
    required: 'false',
    scope: 'WORKFLOW',
    class: 'ATTRIBUTE',
    type: 'STRING'
  }
]

export default {
  Workflow,
  Step,
  Parameter
}