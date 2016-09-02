import StateEnum from '../graphql/types/ClusterNodeStateEnum'
let { ONLINE } = StateEnum.values

export default function startListeners () {
  this.logInfo('* Socket server is now listening')
  this._state = ONLINE

  let currentStatus = () => {
    return {
      id: this._id,
      host: this._host,
      port: this._port,
      state: this._state,
      roles: this._roles
    }
  }

  // socket listeners
  this._io.on('connection', (socket) => {
    socket.emit('connected')
    socket.on('status', () => socket.emit('status', currentStatus()))
    socket.on('heartbeat', () => socket.emit('up', currentStatus()))
  })

  // local event listeners
  this._event.on('heartbeat.poll.complete', () => {
    this.logTrace('Heartbeat poll complete')
  })
}