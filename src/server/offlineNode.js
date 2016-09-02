import StateEnum from '../graphql/types/ClusterNodeStateEnum'
let { OFFLINE } = StateEnum.values

export default function offlineNode (id) {
  this._peers[id] = { state: OFFLINE }
  this._hb[id].disconnect(0)
  delete this._hb[id]
  return this._lib.ClusterNode(`mutation Mutation {
  updateClusterNode (
    id: "${id}",
    roles: [],
    state: ${OFFLINE}
  )
} { id }`)
}