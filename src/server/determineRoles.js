import _ from 'lodash'
import StateEnum from '../graphql/types/ClusterNodeStateEnum'
import RoleEnum from '../graphql/types/ClusterNodeRoleEnum'
let { SCHEDULER, TIEBREAKER, RUNNER } = RoleEnum.values
let { ONLINE } = StateEnum.values

export default function determineRoles (nodes) {
  let scheduler = _.filter(nodes, (node) => (_.includes(node.roles, SCHEDULER) && node.state === ONLINE))
  let tiebreaker = _.filter(nodes, (node) => (_.includes(node.roles, TIEBREAKER) && node.state === ONLINE))
  if (!scheduler.length) return [ SCHEDULER, RUNNER ]
  if (!tiebreaker.length) return [ TIEBREAKER, RUNNER ]
  return [ RUNNER ]
}