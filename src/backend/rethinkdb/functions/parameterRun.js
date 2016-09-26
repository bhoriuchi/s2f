import _ from 'lodash'

export function createParameterRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let parameter = backend.getTypeCollection('Parameter')
    let table = backend.getTypeCollection('ParameterRun')

    return parameter.get(args.parameter).eq(null).branch(
      r.error(`Parameter ${args.parameter} not found`),
      table.insert(args, { returnChanges: true })('changes')
        .nth(0)('new_val')
    )
      .run(connection)
  }
}

export function readParameterRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('ParameterRun')

    if (_.isArray(info.path) && info.path.join('.').match(/context$/) && source && source.id) {
      return table.filter({ parentId: source.id }).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateParameterRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('ParameterRun')

    return table.get(args.id).eq(null).branch(
      r.error('ParameterRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteParameterRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('ParameterRun')

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