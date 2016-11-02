export default {
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
}