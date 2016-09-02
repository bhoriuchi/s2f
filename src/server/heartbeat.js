import _ from 'lodash'
import SocketClient from 'socket.io-client'

export default function heartbeat () {
  return this.getNodeConfig((err, nodes) => {
    let peers = _.filter(nodes, (v) => v.id !== this._id)
    this._repliesRemaining = peers.length

    // checks if the polling of all nodes is complete
    let pollComplete = () => {
      this._repliesRemaining--
      if (!this._repliesRemaining) this._event.emit('heartbeat.poll.complete')
      else this.logTrace('Remaining Replies', this._repliesRemaining)
    }

    _.forEach(peers, (node) => {
      if (!_.has(this._hb, node.id)) {
        let socket = SocketClient(`http://${node.host}:${node.port}`, { timeout: this._hbTimeout })
        this._hb[node.id] = socket
        socket.on('connected', () => socket.emit('heartbeat'))
        socket.on('up', (data) => {
          pollComplete()
          this._peers[node.id] = data
          this.logTrace((new Date()).toISOString(), ` - ${data.host}:${data.port} is up`)
        })
        socket.on('connect_error', () => {
          if (this._hb[node.id]) {
            pollComplete()
            this.offlineNode(node.id)
          }
        })
        socket.on('connect_timeout', () => {
          if (this._hb[node.id]) {
            pollComplete()
            this.offlineNode(node.id)
          }
        })
      } else {
        this._hb[node.id].emit('heartbeat')
      }
    })
    setTimeout(() => this.heartbeat(), this._hbInterval)
  })
}