import _ from 'lodash'
import { GraphQLError } from 'graphql/error'
import { isPublished } from './common'

export function destroyStep (backend, ids) {
  let r = backend._r
  let step = backend._db.table(backend._tables.Step.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  ids = _.isString(ids) ? [ids] : ids
  return step.filter((s) => r.expr(ids).contains(s('id')))
    .delete()
    .do(() => {
      return parameter.filter((p) => r.expr(ids).contains(p('parentId')))
        .delete()
    })
    .do(() => true)
}

export function createStep (backend) {
  let r = backend._r
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  //let task = backend._db.table(backend._tables.Task.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    let { createTemporalStep, filterTemporalTask } = this.globals._temporal

    if (_.includes(['START', 'END'], args.type)) {
      throw new GraphQLError(`A ${args.type} type can only be added during new workflow creation`)
    }
    if (args.type === 'TASK' && !args.task) {
      throw new GraphQLError(`A step of type TASK must specifiy a published tasks recordId`)
    }
    args.entityType = 'STEP'

    return workflow.get(args.workflowId)
      .eq(null)
      .branch(
        r.error(`Workflow ${args.workflowId} does not exist`),
        r.expr(args.type).ne('TASK').branch(
          createTemporalStep(args)('changes').nth(0)('new_val'),
          filterTemporalTask({ recordId: args.task })
            .coerceTo('array')
            .do((task) => {
              return task.count().eq(0).branch(
                r.error('The task specified does not have a current published version'),
                createTemporalStep(r.expr(args).merge({ source: task.nth(0)('source') }))('changes').nth(0)('new_val')
              )
            })
        )
      )
      .run(connection)
      .then((step) => {
        if (args.type !== 'TASK') return step

        // copy the current task parameters to the step
        // since it is required that the step already be published there is no need
        // to keep the parameters synced between the step and task
        return filterTemporalTask({ recordId: args.task })
          .nth(0)('id')
          .do((taskId) => {
            return parameter.filter({ parentId: taskId })
              .map((param) => param.merge({ id: r.uuid(), scope: 'STEP', parentId: step.id }))
              .forEach((p) => parameter.insert(p))
              .do(() => step)
          })
          .run(connection)
      })
  }
}

export function readStep (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection
  return function (source = {}, args, context = {}, info) {
    let { filterTemporalStep } = this.globals._temporal
    context.date = args.date || context.date
    let filter = filterTemporalStep(args)

    if (source.id) {
      filter = table.filter({ workflowId: source.id })
      if (args.first) {
        filter = filter.filter({ type: 'START' })
          .nth(0)
          .do((start) => {
            return table.get(start('success'))
              .count()
              .eq(0)
              .branch(
                r.expr([]),
                r.expr([table.get(start('success'))])
              )
          })
      }
    }

    return filter.run(connection)
  }
}

export function updateStep (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return isPublished(backend, 'Step', args.id).branch(
      r.error('This step is published and cannot be modified'),
      table.get(args.id)
        .update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteStep (backend) {
  let r = backend._r
  let connection = backend._connection
  return function (source, args, context, info) {
    return isPublished(backend, 'Step', args.id).branch(
      r.error('This step is published and cannot be deleted'),
      destroyStep(backend, args.id)
    )
      .run(connection)
  }
}

export default {
  destroyStep,
  createStep,
  readStep,
  updateStep,
  deleteStep
}