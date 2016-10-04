export const Workflow = [
  {
    _temporal: {
      changeLog: [],
      recordId:  '2464780a-92ba-475b-b7a6-c49a0a9d189b',
      validFrom: null,
      validTo: null,
      version: null
    },
    entityType:  'WORKFLOW',
    id:  'de3f6477-aafb-49bb-9c88-ee3d7f65beff',
    name:  'Sub Workflow Test',
    endStep: 'c3dd216f-aa42-472d-806e-7beaf48609ed'
  }
]

export const Step = [
  {
    _temporal: {
      changeLog: [],
      recordId: '9231a271-0f03-418d-ac9c-faa46c59506e',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  'a0c84a22-4bde-4ee7-abc9-f098b082bef0',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '6cb7a7e5-1c6c-468e-8106-29abeb585844',
    name:  'Test Name',
    source:  'console.log("===========");console.log("Sub Workflow Start");console.log("===========");',
    requireResumeKey: false,
    task: '5ca86058-4b93-4feb-8136-554195516cd1',
    success: '845a78a5-a2fa-422c-9cd5-806004be0038',
    timeout: 0,
    type: 'BASIC',
    waitOnSuccess: false,
    workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
  },
  {
    _temporal: {
      changeLog: [],
      recordId:  '4fb2fdd9-8698-4f97-ad37-19bfe9f05bad',
      validFrom: null,
      validTo: null,
      version: null
    } ,
    async: false,
    entityType:  "STEP",
    failsWorkflow: false ,
    id:  '845a78a5-a2fa-422c-9cd5-806004be0038',
    name:  'Hello World',
    requireResumeKey: false,
    subWorkflow: 'c5801b61-a7cd-4995-964b-c0a1f368de7c',
    success: 'c3dd216f-aa42-472d-806e-7beaf48609ed',
    timeout: 0,
    type: 'WORKFLOW',
    waitOnSuccess: false,
    workflowId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff'
  },
  {
    _temporal: {
      changeLog: [],
      recordId: '94aa101f-4a8a-47a8-aae2-699cfeba541c',
      validFrom: null,
      validTo: null,
      version: null
    } ,
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
  }

]

export const Parameter = [
  {
    entityType: 'PARAMETER',
    id: '1cf60c78-bfc9-4845-985c-343923f8c1d1',
    name: 'name',
    parentId: '6cb7a7e5-1c6c-468e-8106-29abeb585844',
    required: 'false',
    scope: 'STEP',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: '3fc2c440-5c1e-442f-9bfd-2250f88b2f0b',
    name: 'message',
    defaultValue: 'Hello',
    parentId: 'de3f6477-aafb-49bb-9c88-ee3d7f65beff',
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