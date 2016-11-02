export default {
  fields: {
    childId: { type: 'String', primary: true },
    folder: { type: 'String' },
    childType: { type: 'FolderChildTypeEnum' }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'folder_membership'
  }
}