import _ from 'lodash'
import SocketClient from 'socket.io-client'

export default function heartbeat () {
  return this.getNodeConfig((err, nodes) => {
    let checkNodes = _.filter(nodes, (v) => v.id !== this._id)
    _.forEach(checkNodes, (node) => {
      if (!_.has(this._hb, node.id)) {
        let socket = SocketClient(`http://${node.host}:${node.port}`, { timeout: this._hbTimeout })
        this._hb[node.id] = socket
        socket.on('connected', () => socket.emit('status'))
        socket.on('status', (data) => {
          console.log((new Date()).toISOString(), '- HB')
        })
        socket.on('connect_error', () => {
          if (this._hb[node.id]) this.offlineNode(node.id)
        })
        socket.on('connect_timeout', () => {
          if (this._hb[node.id]) this.offlineNode(node.id)
        })
      } else {
        this._hb[node.id].emit('status')
      }
    })
    setTimeout(() => {
      this.heartbeat()
    }, this._hbInterval)
  })
}