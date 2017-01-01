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
      type: ['Parameter']
    }
  },
  _temporal: {
    versioned: true
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'task',
    query: {
      /*
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
      */
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
      /*
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
      */
      create: false,
      update: false,
      delete: false,
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
}