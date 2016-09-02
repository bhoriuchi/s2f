import StateEnum from '../graphql/types/ClusterNodeStateEnum'
let { ONLINE } = StateEnum.values

export default function startListeners () {
  console.log('* Socket server is now listening')
  this._state = ONLINE
  this._io.on('connection', (socket) => {
    socket.emit('connected')
    socket.on('status', () => {
      socket.emit('status', {
        host: this._host,
        port: this._port,
        state: this._state,
        roles: this._roles
      })
    })
  })
}