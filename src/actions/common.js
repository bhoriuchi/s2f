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

export default {
  expandGQLErrors,
  gqlResult
}