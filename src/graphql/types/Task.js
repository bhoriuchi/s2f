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
    source: {
      type: 'String',
      nullable: false
    },
    parameters: {
      type: ['Parameter'] /* ,
      resolve: 'readParameter'
      */
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
      }
    }
  }
}