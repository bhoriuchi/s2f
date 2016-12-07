export default {
  handler (socketPayload) {
    this._emitter.emit('workflowcmd', socketPayload)
  }
}