export default {
  fields: {
    id: 'String',
    name: 'String',
    parent: 'String',
    type: 'FolderChildTypeEnum',
    subFolders: {
      type: ['Folder'],
      resolve (source) {
        return Array.isArray(source.subFolders) ? source.subFolders : []
      }
    },
    entities: ['EntitySummary']
  }
}