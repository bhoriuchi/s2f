import _ from 'lodash'
import { GraphQLError } from 'graphql/error'

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
  return function (source, args, context, info) {

  }
}

export function deleteStep (backend) {
  return function (source, args, context, info) {

  }
}



export default {
  cloneStep,
  createStep,
  readStep,
  updateStep,
  deleteStep
}