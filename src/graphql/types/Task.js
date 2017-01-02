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
      type: 'String',
      unique: true
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