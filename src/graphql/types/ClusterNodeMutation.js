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
        roles: { type: ['ClusterRoleEnum'] },
        defaultRole: { type: 'ClusterNodeRoleEnum' },
        state: { type: 'ClusterNodeStateEnum' }
      },
      resolve: 'updateClusterNode'
    },
    deleteClusterNode: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false }
      },
      resolve: 'deleteClusterNode'
    },
    promoteScheduler: {
      type: 'Boolean',
      args: {
        id: { type: 'String', nullable: false },
        roles: { type: ['ClusterNodeRoleEnum'], defaultValue: ['SCHEDULER'] }
      },
      resolve: 'promoteScheduler'
    }
  }
}