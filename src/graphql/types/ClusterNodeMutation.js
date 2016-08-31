export default {
  fields: {
    createClusterNode: {
      type: 'ClusterNode',
      args: {
        host: { type: 'String', nullable: false },
        port: { type: 'Int', defaultValue: 8080 },
        defaultRole: { type: 'ClusterNodeRoleEnum', defaultValue: 'RUNNER' }
      },
      resolve: 'createClusterNode'
    },
    updateClusterNode: {
      type: 'ClusterNode',
      args: {
        id: { type: 'String', nullable: false },
        host: { type: 'String' },
        port: { type: 'Int' },
        defaultRole: { type: 'ClusterNodeRoleEnum' }
      },
      resolve: 'updateClusterNode'
    },
    deleteClusterNode: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteClusterNode'
    }
  }
}