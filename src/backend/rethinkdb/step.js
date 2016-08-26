import _ from 'lodash'

export function newStep (backend, payload, generateIds = true) {
  let uuid = backend._r.uuid
  if (generateIds) _.isArray(payload) ? _.forEach(payload, (p) => { p.id = uuid() }) : payload.id = uuid()
  return backend._db.table(backend._tables.Step.table).insert(payload, { returnChanges: true })
}

export function cloneStep (backend, id) {

}

export function create (backend) {
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return workflow.get(args.workflowId).do((wf) => {
      return newStep(backend, _.omit(args, 'workflowId'))('changes').nth(0)('new_val').do((s) => {
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
    if (isNested(source)) return table.filter((step) => r.expr(source.steps).contains(step('id'))).run(connection)
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
  newStep,
  cloneStep,
  create,
  read,
  update,
  del
}