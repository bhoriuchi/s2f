import _ from 'lodash'

export function createWorkflowRunThread (backend) {
  let table = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    args.status = 'CREATED'
    return table.insert(args, { returnChanges: true })('changes')
      .nth(0)('new_val')
      .run(connection)
  }
}

export function readWorkflowRunThread (backend) {
  let table = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    if (_.isArray(info.path) && info.path.join('.').match(/threads$/) && source && source.id) {
      return table.filter({ workflowRun: source.id }).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateWorkflowRunThread (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRunThead not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteWorkflowRunThread (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRunThead not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createWorkflowRunThread,
  readWorkflowRunThread,
  updateWorkflowRunThread,
  deleteWorkflowRunThread
}