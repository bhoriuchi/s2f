export default {
  handler (socketPayload) {
    this._emitter.emit('workflow', socketPayload)
  }
}