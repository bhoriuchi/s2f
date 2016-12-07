export default {
  handler ({ payload, socket, requestId }) {
    return this.backend.cmd(payload)
      .then((result) => socket.emit(`result.${requestId}`, result))
      .catch((error) => socket.emit(`result.${requestId}`, { errors: [error] }))
  }
}