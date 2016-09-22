export default {
  extendFields: ['TemporalType', 'Entity', 'Named', 'Described'],
  fields: {
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
    query: {
      read: {
        resolve: 'readTask'
      }
    },
    mutation: {
      create: {
        resolve: 'createTask'
      },
      update: {
        resolve: 'updateTask'
      },
      delete: {
        resolve: 'deleteTask'
      }
    }
  }
}