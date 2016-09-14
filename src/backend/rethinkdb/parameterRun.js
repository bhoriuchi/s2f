import _ from 'lodash'
import chalk from 'chalk'

export function createParameterRun (backend) {
  let r = backend._r
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let table = backend._db.table(backend._tables.ParameterRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return parameter.get(args.parameter).eq(null).branch(
      r.error(`Parameter ${args.parameter} not found`),
      table.insert(args, { returnChanges: true })('changes')
        .nth(0)('new_val')
    )
      .run(connection)
  }
}

export function readParameterRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ParameterRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    if (_.isArray(info.path) && info.path.join('.').match(/context$/) && source && source.id) {
      return table.filter({ parentId: source.id }).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateParameterRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ParameterRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('ParameterRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteParameterRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.ParameterRun.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('ParameterRun not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createParameterRun,
  readParameterRun,
  updateParameterRun,
  deleteParameterRun
}