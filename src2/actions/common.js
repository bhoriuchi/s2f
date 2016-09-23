import _ from 'lodash'
import SocketClient from 'socket.io-client'

// cleans up socket connection
export function disconnectSocket (socket) {
  socket.emit(DISCONNECT)
  socket.disconnect(0)
  return true
}

/*
 * Sends a message and then disconnects after response or error
 */
export function emitOnce (host, port, evt, listeners, onError = () => false, timeout = 2000) {
  let disconnected = false
  let socket = SocketClient(`http://${host}:${port}`, { timeout })

  socket.on(CONNECTED, () => socket.emit(evt))

  _.forEach(listeners, (fn, e) => {
    socket.on(e, (data) => {
      disconnected = disconnectSocket(socket)
      return fn(data)
    })
  })

  socket.on(CONNECT_ERROR, () => {
    if (!disconnected) {
      disconnected = disconnectSocket(socket)
      return onError()
    }
  })
  socket.on(CONNECT_TIMEOUT, () => {
    if (!disconnected) {
      disconnected = disconnectSocket(socket)
      return onError()
    }
  })
}

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
  console.log(result)
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

export default {
  expandGQLErrors,
  gqlResult,
  convertType,
  isNested
}