import _ from 'lodash'

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
  let GraphQLError = backend._graphql.GraphQLError
  if (result.errors) return cb(new GraphQLError(expandGQLErrors(result.errors)))
  return cb(null, result.data)
}


export function convertType (type, value) {
  switch (type) {
    case 'ARRAY':
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
      if (_.isObject(value)) return value
    case 'STRING':
      if (_.isString(value)) return String(value)
    default:
      throw new Error('the value provided could not be cast to the appropriate type')
  }
}

export default {
  expandGQLErrors,
  gqlResult,
  convertType
}