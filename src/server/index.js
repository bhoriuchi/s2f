import _ from 'lodash'
import chalk from 'chalk'
import http from 'http'
import SocketServer from 'socket.io'
import StateEnum from '../graphql/types/ClusterNodeStateEnum'
import RoleEnum from '../graphql/types/ClusterNodeRoleEnum'
let { SCHEDULER, TIEBREAKER, RUNNER } = RoleEnum.values
let { OFFLINE, ONLINE } = StateEnum.values

function handler (req, res) {
  res.writeHead(200)
  res.end('ONLINE')
}

// server object constructor
function S2FServer (lib, helper) {
  let { error, pretty, options: { cmd, host, port, role, id } } = helper
  this._lib = lib
  this._roles = []
  this._state = OFFLINE
  this._host = host
  this._port = port
  this._app = http.createServer(handler)
  this._app.listen(port)
  this._io = new SocketServer(this._app)

  console.log(`* Starting s2f server on ${host}:${port}`)

  // get current state of the environment
  return this._lib.ClusterNode('{ readClusterNode { id, host, port, roles, defaultRole, state } }')
    .then((nodes) => {
      let config = _.filter(_.get(nodes, 'data.readClusterNode', []), { host, port })
      if (nodes.errors) return error(pretty(nodes.errors))
      if (!config.length) return error(`The host:port ${host}:${port} has not been added yet`, true)
      this._config = config[0]
      this.startListeners()
    })
    .catch(error)
}

// start socket listeners
S2FServer.prototype.startListeners = function () {
  console.log('* Socket server is now listening')
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

export default S2FServer