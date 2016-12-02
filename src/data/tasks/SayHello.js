export const Task = [
  {
    _temporal: {
      changeLog: [
        {
          date: new Date(1473606625377),
          message:  'Publish',
          type:  'PUBLISH',
          user:  'SYSTEM'
        }
      ] ,
      recordId:  '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
      validFrom: new Date(1473606625377),
      validTo: null,
      version:  '0.1.0'
    },
    entityType:  'TASK',
    id:  '0ea85a8a-ba97-4c31-8ed0-37926989b384',
    name:  'Say Hello',
    source:  'console.log("Hello", name)'
  },
  {
    _temporal: {
      recordId:  '4c35b5a7-e971-4719-9846-ca06db2f8eb2',
      validFrom: null,
      validTo: null,
      version: null
    },
    entityType:  'TASK',
    id:  'b98548c6-d294-4406-88c1-3d7cffb97cfa',
    name:  'Say Hello',
    source:  'console.log("Hi", name)'
  }
]

export const Parameter = [
  {
    entityType: 'PARAMETER',
    id: '0a329a80-3b97-4b83-832f-7f9c960afdfc',
    name: 'name',
    parentId: '0ea85a8a-ba97-4c31-8ed0-37926989b384',
    required: 'false',
    scope: 'TASK',
    class: 'INPUT',
    type: 'STRING'
  },
  {
    entityType: 'PARAMETER',
    id: 'fed6aa1e-5a25-4cd6-8b35-20ad0e6547df',
    name: 'name',
    parentId: 'b98548c6-d294-4406-88c1-3d7cffb97cfa',
    required: 'false',
    scope: 'TASK',
    class: 'INPUT',
    type: 'STRING'
  }
]

export default { Task, Parameter }