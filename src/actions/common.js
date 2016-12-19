import _ from 'lodash'
import ParameterClassEnum from '../graphql/types/ParameterClassEnum'
let { values: { INPUT, OUTPUT } } = ParameterClassEnum

export function expandGQLErrors (errors) {
  if (_.isArray(errors)) {
    return _.map(errors, (e) => {
      try {
        return _.isObject(e) ? JSON.stringify(e) : e
      } catch (err) {
        return e
      }
    })
  }
  try {
    return _.isObject(errors) ? JSON.stringify(errors) : errors
  } catch (err) {
    return errors
  }
}

export function gqlResult (backend, result, cb) {
  let GraphQLError = backend.graphql.GraphQLError
  if (result.errors) return cb(new GraphQLError(expandGQLErrors(result.errors)))
  return cb(null, result.data)
}

export function safeParse (value) {
  try {
    return JSON.parse(value)
  } catch (err) {
    return value
  }
}

export function convertType (type, name, value) {
  if (!type || !name) throw new Error('could not determine type of variable name to convert')

  switch (type) {
    case 'ARRAY':
      value = _.isString(value) ? safeParse(value) : value
      if (_.isArray(value)) return value
    case 'BOOLEAN':
      value = _.isString(value) ? safeParse(value) : value
      if (_.isBoolean(value)) return Boolean(value)
    case 'DATE':
      try {
        return new Date(value)
      } catch (err) {}
    case 'NUMBER':
      value = _.isString(value) ? safeParse(value) : value
      if (_.isNumber(value)) return Number(value)
    case 'OBJECT':
      value = _.isString(value) ? safeParse(value) : value
      if (_.isObject(value)) return value
    case 'STRING':
      if (_.isString(value)) return String(value)
    default:
      throw new Error(`${name} could not be cast to type ${type}`)
  }
}

export function isNested (info) {
  return _.get(info, 'path', []).length > 1
}


export function mapInput (input, context, parameters) {
  let params = {}

  _.forEach(parameters, (param) => {
    if (param.class === INPUT) {
      if (param.mapsTo) {
        let { parameter, value } = _.find(context, (ctx) => _.get(ctx, 'parameter.id') === param.mapsTo) || {}
        if (parameter) params[param.name] = value
      } else {
        try {
          params[param.name] = convertType(param.type, param.name, _.get(input, param.name))
        } catch (err) {}
      }
    }
  })

  return params
}

export function winTieBreak (thread, ending) {
  if (!_.without(ending, thread).length) return true
  return ending.sort()[0] === thread
}

export default {
  expandGQLErrors,
  gqlResult,
  convertType,
  isNested,
  mapInput,
  winTieBreak
}