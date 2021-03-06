export const Workflow = [
  {
    _temporal: {
      changeLog: [],
      recordId:  'c5801b61-a7cd-4995-964b-c0a1f368de7c',
      validFrom: null,
      validTo: null,
      version: null
    },
    entityType:  'WORKFLOW',
    id:  'f4a8f894-06ba-4213-80f1-80ff72e1039b',
    name:  'Hello World',
    endStep: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4'
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'c5801b61-a7cd-4995-964b-c0a1f368de7c',
      validFrom: new Date('2016-01-01'),
      validTo: null,
      version: '0.1.0'
    },
    entityType:  'WORKFLOW',
    id:  'e38faf1f-1ae4-4450-91b8-afb7c2e472c8',
    name:  'Hello World',
    endStep: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb'
  }
]

export const Step = [
  {
    _temporal: {
      changeLog: [],
      recordId: '2f703d65-3aa7-40fc-b99d-3a0610ee6645',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'e86715f1-11a4-402c-9aa3-1b7c61a4af8c',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '68e5264a-89ef-4c85-9235-09d8e944580f',
    name:  'Say Hello',
    requireResumeKey: false,
    task: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
    versionArgs: {},
    success: 'd2618ad7-a4d2-4213-b921-935b6eeafaf4',
    timeout: 0,
    type: 'TASK',
    waitOnSuccess: false,
    workflowId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b'
  },
  {
    _temporal: {
      changeLog: [],
      recordId: '19a1e436-3532-4f51-8508-868d4f234bd2',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId: 'b0199df1-50be-4958-9e51-39104ead1bee',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'cc76353e-5de4-44e8-8523-fd64f5a9149c',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  'f8904d60-a73c-4348-867a-6d5df19bf6cc',
    name:  'Say Hello',
    requireResumeKey: false,
    task: '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
    versionArgs: {},
    success: '6c8f92a0-661c-49c8-981d-b44dc5a7feeb',
    timeout: 0,
    type: 'TASK',
    waitOnSuccess: false,
    workflowId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8'
  },
  {
    _temporal: {
      changeLog: [],
      recordId: '758c4bea-0fc0-4f61-888c-7ef45d8fef35',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  }
]

export const Parameter = [
  {
    entityType: 'PARAMETER',
    id: 'a2189572-dce9-46b8-897f-18d5bb221c08',
    name: 'name',
    parentId: '68e5264a-89ef-4c85-9235-09d8e944580f',
    required: 'false',
    scope: 'STEP',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '1e5782b6-e8c0-47c0-b4bc-a0eca56805c1',
    name: 'message',
    defaultValue: 'Hello',
    parentId: 'f4a8f894-06ba-4213-80f1-80ff72e1039b',
    required: 'false',
    scope: 'WORKFLOW',
    class: 'ATTRIBUTE',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '97eacabd-6dbd-42fa-b6c4-3e8c49cde118',
    name: 'name',
    parentId: 'f8904d60-a73c-4348-867a-6d5df19bf6cc',
    required: 'false',
    scope: 'STEP',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: 'd01a6dad-9a0a-4eb5-abf6-04a212eda686',
    name: 'message',
    defaultValue: 'Hello',
    parentId: 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8',
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