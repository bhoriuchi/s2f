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


export function cloneStep (backend, id) {

}

export function createStep (backend) {
  let r = backend._r
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    let { createTemporalStep } = this.globals._temporal
    let err = new GraphQLError(`A ${args.type} type can only be added during new workflow creation`)
    if (_.includes(['START', 'END'], args.type)) throw err
    args.entityType = 'STEP'
    return workflow.get(args.workflowId)
      .eq(null)
      .branch(
        r.error(`Workflow ${args.workflowId} does not exist`),
        createTemporalStep(args)('changes').nth(0)('new_val')
      )
      .run(connection)
  }
}

export function readStep (backend) {
  let table = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection
  return function (source = {}, args, context, info) {
    let { filterTemporalStep } = this.globals._temporal
    let filter = source.id ? table.filter({ workflowId: source.id }) : filterTemporalStep(args)
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
  cloneStep,
  createStep,
  readStep,
  updateStep,
  deleteStep
}