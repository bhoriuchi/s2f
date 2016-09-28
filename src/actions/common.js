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

export function convertType (type, name, value) {
  if (!type || !name) throw new Error('could not determine type of variable name to convert')
  switch (type) {
    case 'ARRAY':
      if (_.isString(value)) {
        try {
          value = JSON.parse(value)
        } catch (err) {}
      }
      if (_.isArray(value)) return value
    case 'BOOLEAN':
      let strBoolean = ['true', 'TRUE', 'false', 'FALSE', 0, 1, '0', '1']
      if (_.isBoolean(value) || _.includes(strBoolean, value)) return Boolean(value)
    case 'DATE':
      try {
        return new Date(value)
      } catch (err) {}
    case 'NUMBER':
      if (_.isNumber(value)) return Number(value)
    case 'OBJECT':
      if (_.isString(value)) {
        try {
          value = JSON.parse(value)
        } catch (err) {}
      }
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
    if (param.class === OUTPUT) {
      params[param.name] = null
    } else if (param.class === INPUT) {
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

export default {
  expandGQLErrors,
  gqlResult,
  convertType,
  isNested,
  mapInput
}