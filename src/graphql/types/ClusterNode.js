export default {
  fields: {
    id: { type: 'String', nullable: false },
    host: { type: 'String' },
    port: { type: 'Int' },
    roles: { type: ['ClusterNodeRoleEnum'] },
    defaultRole: { type: 'ClusterNodeRoleEnum' },
    state: { type: 'ClusterNodeStateEnum' }
  }
}