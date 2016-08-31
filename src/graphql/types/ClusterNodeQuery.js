export default {
  fields: {
    readClusterNode: {
      type: ['ClusterNode'],
      args: {
        id: { type: 'String' }
      },
      resolve: 'readClusterNode'
    }
  }
}