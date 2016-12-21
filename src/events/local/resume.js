import _ from 'lodash'
import resumeStep from '../../actions/runStep/resumeStep'

export default {
  handler ({ payload, socket, requestId }) {
    let log = this.backend.log
    let eventName = `workflow.resume.${requestId}`
    let event = _.get(this.backend, 'server._emitter')
    let { resumeKey, status, context } = payload
    if (!resumeKey || !requestId) {
      let errors = [new Error('no resumeKey or requestId specified')]
      log.error({ resumeKey, requestId }, 'missing resume key or requestId')
      if (socket) socket.emit(eventName, { errors })
      return event.emit(eventName, { errors })
    }

    return resumeStep(this.backend, resumeKey, status, context, (error) => {
      let result = error ? { errors: [error] } : { status: 'OK' }
      if (result.errors) log.error({ errors: result.errors }, 'failed to resume step')
      if (socket) socket.emit(eventName, result)
      return event.emit(eventName, result)
    })
  }
}