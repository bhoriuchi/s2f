import _ from 'lodash'
import { GraphQLError } from 'graphql/error'

export function cloneStep (backend, id) {

}

export function create (backend) {
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    let { createTemporalStep } = this.globals._temporal

    if (_.includes(['START', 'END'], args.type)) throw new GraphQLError(`A ${args.type} type can only be added during \
new workflow creation`)

    args.parameters = []

    return workflow.get(args.workflowId).do((wf) => {
      return createTemporalStep(_.omit(args, 'workflowId'))('changes').nth(0)('new_val').do((s) => {
        return workflow.get(args.workflowId).update((oldVer) => {
          return {
            steps: oldVer('steps').append(s('id'))
          }
        }).do(() => s)
      })
    }).run(connection)
  }
}

export function read (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    let { isNested, filterTemporalStep } = this.globals._temporal
    if (isNested(source)) {
      if (_.isObject(_.get(source, 'steps[0]'))) return source.steps
      return table.filter((step) => r.expr(source.steps).contains(step('id'))).run(connection)
    }
    return filterTemporalStep(args).run(connection)
  }
}

export function update (backend) {
  return function (source, args, context, info) {

  }
}

export function del (backend) {
  return function (source, args, context, info) {

  }
}



export default {
  cloneStep,
  create,
  read,
  update,
  del
}