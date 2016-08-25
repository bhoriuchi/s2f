import _ from 'lodash'

export function newStep (backend, payload, generateIds = true) {
  let uuid = backend._r.uuid
  if (generateIds) _.isArray(payload) ? _.forEach(payload, (p) => { p.id = uuid() }) : payload.id = uuid()
  return backend._db.table(backend._tables.Step.table).insert(payload, { returnChanges: true })
}

export function cloneStep (backend, id) {

}

export function create (backend) {
  return function (source, args, context, info) {

  }
}

export function read (backend) {
  return function (source, args, context, info) {

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
  read
}