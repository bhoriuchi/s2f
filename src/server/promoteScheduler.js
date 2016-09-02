import _ from 'lodash'
import RoleEnum from '../graphql/types/ClusterNodeRoleEnum'
let { SCHEDULER } = RoleEnum.values

export default function promoteScheduler (id, roles = []) {
  let params = [`id: "${id}"`]
  roles = _.union(roles, [SCHEDULER])
  params.push(`roles: [${roles.join(', ')}]`)

  let query = `mutation Mutation {
  promoteScheduler (${params.join(', ')})
}`

  return this._lib.ClusterNode(query)
}