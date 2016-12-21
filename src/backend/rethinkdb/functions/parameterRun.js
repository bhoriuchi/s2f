import _ from 'lodash'
import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
let { values: { ATTRIBUTE } } = ParameterClassEnum

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
  return function (source = {}, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('ParameterRun')

    let infoPath = _.get(info, 'path', [])
    let currentPath = _.isArray(infoPath) ? _.last(infoPath) : infoPath.key

    if (currentPath === context && source.id) {
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

export function updateAttributeValues (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let parameterRun = backend.getTypeCollection('ParameterRun')
    let parameter = backend.getTypeCollection('Parameter')

    return r.expr(args.values).forEach((value) => {
      return parameterRun.get(value('id'))
        .do((param) => {
          return param.eq(null).branch(
            r.error('ParameterRun not found'),
            parameter.get(param('parameter'))
              .do((p) => {
                return p.eq(null).or(p('class').ne(ATTRIBUTE)).branch(
                  r.error('Invalid Parameter type'),
                  parameterRun.get(value('id')).update({ value: value('value') })
                )
              })
          )
        })
    })
      .do(() => true)
      .run(connection)
  }
}

export default {
  createParameterRun,
  readParameterRun,
  updateParameterRun,
  deleteParameterRun,
  updateAttributeValues,
}