import _ from 'lodash'
import { isPublished } from './common'

export function createTask (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getCollection('Task')

    let { createTemporalTask } = this.globals._temporal
    args.entityType = 'TASK'
    return table.filter((t) => t('name').match(`(?i)^${args.name}$`))
      .count()
      .ne(0)
      .branch(
        r.error(`A task with the name ${args.name} already exists`),
        createTemporalTask(args)('changes').nth(0)('new_val')
      )
      .run(connection)
  }
}

export function readTask (backend) {
  return function (source, args, context = {}, info) {
    let { r, connection } = backend
    let sourceTask = _.get(source, 'task') || _.get(source, 'task.id')

    let { temporalFilter, temporalMostCurrent } = this.globals._temporal
    context.date = args.date || context.date
    let filter = r.expr(null)
    if (!source) {
      if (!_.keys(args).length) return temporalMostCurrent('Task').run(connection)
      filter = temporalFilter('Task', args)
    } else if (sourceTask) {
      filter = temporalFilter('Task', { recordId: sourceTask, date: context.date })
        .coerceTo('array')
        .do((task) => {
          return task.count().eq(0).branch(
            null,
            task.nth(0)
          )
        })
    }
    return filter.run(connection)
  }
}

export function readTaskVersions (backend) {
  return function (source, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getCollection('Task')
    let filter = table.filter({ _temporal: { recordId: args.recordId } })
    if (args.offset) filter = filter.skip(args.offset)
    if (args.limit) filter = filter.limit(args.limit)
    return filter.run(connection)
  }
}

export function updateTask (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getCollection('Task')

    return isPublished(backend, 'Task', args.id).branch(
      r.error('This task is published and cannot be modified'),
      table.get(args.id)
        .update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteTask (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let task = backend.getCollection('Task')
    let parameter = backend.getCollection('Parameter')
    let step = backend.getCollection('Step')

    return isPublished(backend, 'Task', args.id).branch(
      r.error('This task is published and cannot be deleted'),
      step.filter((s) => {
        return s('task')
          .eq(args.id)
          .and(s('_temporal')('version').ne(null))
      })
        .count()
        .ne(0)
        .branch(
          r.error('This task belongs to a published step and cannot be deleted'),
          task.get(args.id)
            .delete()
            .do(() => {
              return parameter.filter({ parentId: args.id })
                .delete()
                .do(() => true)
            })
        )
    )
      .run(connection)
  }
}

export default {
  createTask,
  readTask,
  readTaskVersions,
  updateTask,
  deleteTask
}