export default {
  fields: {
    id: 'String',
    name: 'String',
    parent: 'String',
    type: 'FolderChildTypeEnum',
    subFolders: ['Folder'],
    entities: ['EntitySummary']
  }
}