import _ from 'lodash'

export function createWorkflowRunThread (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRunThread')

    args.status = 'CREATED'
    return table.insert(args, { returnChanges: true })('changes')
      .nth(0)('new_val')
      .run(connection)
  }
}

export function readWorkflowRunThread (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRunThread')

    if (source && source.workflowRunThread) {
      return table.get(source.workflowRunThread).run(connection)
    }

    if (_.isArray(info.path) && info.path.join('.').match(/threads$/) && source && source.id) {
      return table.filter({ workflowRun: source.id }).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateWorkflowRunThread (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRunThread')

    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRunThead not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteWorkflowRunThread (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRunThread')

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