import _ from 'lodash'
import { GraphQLError } from 'graphql/error'
import StateEnum from '../../graphql/types/ClusterNodeStateEnum'
import RoleEnum from '../../graphql/types/ClusterNodeRoleEnum'
let { SCHEDULER, TIEBREAKER, RUNNER } = RoleEnum.values
let { OFFLINE } = StateEnum.values

export function createClusterNode (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ClusterNode.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    args.roles = []
    args.state = OFFLINE

    // get current config
    return table.run(connection).then((nodes) => {

      // check if the node has already been added
      if (_.filter(nodes, { host: args.host, port: args.port }).length) {
        throw new GraphQLError(`A node has already been added with host:port ${args.host}:${args.port}`)
      }

      // get current status of scheduler and tiebreaker
      let defScheduler = _(nodes).filter({ defaultRole: SCHEDULER }).map('id').value()
      // let curScheduler = _(nodes).filter((v) => _.includes(v.roles, SCHEDULER)).map('id').value()
      let defTiebreaker = _(nodes).filter({ defaultRole: TIEBREAKER }).map('id').value()
      // let curTiebreaker = _(nodes).filter((v) => _.includes(v.roles, TIEBREAKER)).map('id').value()

      // if there are no nodes, the node must be the scheduler
      if (!nodes.length) {
        args.defaultRole = SCHEDULER
        return table.insert(args, { returnChanges: true })('changes')
          .nth(0)('new_val')
          .run(connection)
      } else if (args.defaultRole === SCHEDULER && defScheduler.length) {
        return table.filter((n) => r.expr(defScheduler).contains(n('id')))
          .update({ defaultRole: RUNNER })
          .do(() => {
            return table.insert(args, { returnChanges: true })('changes')
              .nth(0)('new_val')
          })
          .run(connection)
      } else if (args.defaultRole === TIEBREAKER && defTiebreaker.length) {
        return table.filter((n) => r.expr(defTiebreaker).contains(n('id')))
          .update({ defaultRole: RUNNER })
          .do(() => {
            return table.insert(args, { returnChanges: true })('changes')
              .nth(0)('new_val')
          })
          .run(connection)
      }

      // default add
      return table.insert(args, { returnChanges: true })('changes')
        .nth(0)('new_val')
        .run(connection)
    })
  }
}

export function readClusterNode (backend) {
  let table = backend._db.table(backend._tables.ClusterNode.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return (args.id ? table.filter({ id: args.id }) : table).run(connection)
  }
}

export function updateClusterNode (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ClusterNode.table)
  let connection = backend._connection
  return function (source, args, context, info) {

  }
}

export function deleteClusterNode (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ClusterNode.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    // check if the node is a tiebreaker or scheduler
    //  if true
    //    promote new tiebreaker or scheduler
    //    when promote finished send shutdown event to cluster if online
    //    remove from db
    //  if false
    //    remove from db
  }
}

export default {
  createClusterNode,
  readClusterNode,
  updateClusterNode,
  deleteClusterNode
}