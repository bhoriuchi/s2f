import _ from 'lodash'
import { isPublished } from './common'

export function createTask (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Task.table)
  let connection = backend._connection
  return function (source, args, context, info) {
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
  let r = backend._r
  let connection = backend._connection
  return function (source, args, context = {}, info) {
    let { filterTemporalTask } = this.globals._temporal
    context.date = args.date || context.date
    let filter = r.expr(null)
    if (!source) filter = filterTemporalTask(args)
    else if (source.task) filter = filterTemporalTask({ recordId: source.task, date: context.date }).nth(0)
    return filter.run(connection)
  }
}

export function updateTask (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Task.table)
  let connection = backend._connection
  return function (source, args, context, info) {
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
  let r = backend._r
  let task = backend._db.table(backend._tables.Task.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let step = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection
  return function (source, args, context, info) {
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
  updateTask,
  deleteTask
}