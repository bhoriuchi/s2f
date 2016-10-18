export const Workflow = [
  {
    _temporal: {
      changeLog: [],
      recordId: '72264666-5e7b-4bd7-b6f6-efff3a5aa73c',
      validFrom: null,
      validTo: null,
      version: null
    },
    entityType: 'WORKFLOW',
    id:  '170ab3d5-4ff4-41ed-b875-010067d1ebc5',
    name:  'Fork Join Test',
    endStep: '44dad1a6-31d6-4d9b-9106-b80d05823195'
  }
]

export const Step = [
  {
    _temporal: {
      changeLog: [],
      recordId: 'f32485c9-3087-43bc-9565-55a594fe9224',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'f1b70a2c-e583-4fcb-abf0-ae01621678c5',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  'b6a0edaa-2417-4e75-8083-c62250dae391',
    name:  'Fork',
    requireResumeKey: false,
    timeout: 0,
    type: 'FORK',
    waitOnSuccess: false,
    workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'e432ac48-6f52-4776-8c20-842246fe54f9',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: true,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '80c73966-aac8-4f7b-b889-e64363322b4b',
    name:  'Fork Left',
    source:  'console.log("===========");\nconsole.log("=========== Forking Left", name);\nconsole.log("===========")',
    requireResumeKey: false,
    success: '453721c9-9347-4d22-a07f-b85630954835',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    fork: 'b6a0edaa-2417-4e75-8083-c62250dae391',
    workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
  },

  {
    _temporal: {
      changeLog: [],
      recordId:  '2108ead8-917f-43ef-ba2a-0d074bb300bd',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '453721c9-9347-4d22-a07f-b85630954835',
    name:  'After Fork Left',
    source:  'console.log("===========");\nconsole.log("=========== After Fork Left");\nconsole.log("===========")',
    requireResumeKey: false,
    success: 'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
  },

  {
    _temporal: {
      changeLog: [],
      recordId:  '86393566-88b7-4971-97bf-6f60ea8df80c',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '3e5d2306-d12d-48f9-a9ee-a4b53acc753b',
    name:  'Fork Right',
    source:  'console.log("===========");\nconsole.log("=========== Forking Right");\nconsole.log("===========")',
    requireResumeKey: false,
    success: 'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    fork: 'b6a0edaa-2417-4e75-8083-c62250dae391',
    workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  '75c03bdd-ec3d-49ad-9ecb-207e9b511869',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  'b97ca7ae-b5de-4204-8440-5b695dfe45f9',
    name:  'Join',
    requireResumeKey: false,
    timeout: 0,
    type: 'JOIN',
    success: '44dad1a6-31d6-4d9b-9106-b80d05823195',
    waitOnSuccess: false,
    workflowId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5'
  },
  {
    _temporal: {
      changeLog: [],
      recordId: '7af16dd4-346a-4527-b9d4-b58d31017c4d',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  }
]

export const Parameter = [
  {
    entityType: 'PARAMETER',
    id: 'c9cf9ca4-4053-4c32-b052-ad79f262df27',
    name: 'name',
    parentId: '80c73966-aac8-4f7b-b889-e64363322b4b',
    required: 'false',
    scope: 'STEP',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '4686b2eb-7815-4bad-a941-dcbd36f1fba7',
    name: 'name',
    parentId: '80c73966-aac8-4f7b-b889-e64363322b4b',
    required: 'false',
    scope: 'STEP',
    mapsTo: '9bbf9716-f6eb-4dd5-a9c5-b44fb29f93d0',
    class: 'OUTPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '9bbf9716-f6eb-4dd5-a9c5-b44fb29f93d0',
    name: 'message',
    defaultValue: 'Hello',
    parentId: '170ab3d5-4ff4-41ed-b875-010067d1ebc5',
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