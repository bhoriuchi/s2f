export default {
  handler ({ payload, socket, requestId }) {
    let { query, rootValue, contextValue, variableValues, operationName } = payload
    return this.backend.lib.S2FWorkflow(query, rootValue, contextValue, variableValues, operationName)
      .then((result) => {
        if (socket) socket.emit(`result.${requestId}`, result)
      })
      .catch((error) => {
       if (socket) socket.emit(`result.${requestId}`, { errors: [error] })
      })
  }
}