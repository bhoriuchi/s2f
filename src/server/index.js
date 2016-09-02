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
  this._hb = {}
  this._pretty = pretty
  this._error = error
  this._lib = lib
  this._roles = []
  this._state = OFFLINE
  this._host = host
  this._port = port
  this._app = http.createServer(handler)
  this._app.listen(port)
  this._io = new SocketServer(this._app)

  console.log(`* Starting s2f server on ${host}:${port}`)

  return this.getNodeConfig((nodes, config) => {
    this._roles = this.determineRoles(nodes)
    this.startListeners()
  })
}

// gets the current node configuration
S2FServer.prototype.getNodeConfig = function (cb) {
  let host = this._host
  let port = this._port
  return this._lib.ClusterNode('{ readClusterNode { id, host, port, roles, defaultRole, state } }')
    .then((nodes) => {
      let nodeConfigs = _.get(nodes, 'data.readClusterNode', [])
      let config = _.filter(nodeConfigs, { host, port })
      if (nodes.errors) return this._error(this._pretty(nodes.errors))
      if (!config.length) return this._error(`The host:port ${host}:${port} has not been added yet`, true)
      cb(null, nodeConfigs, config)
    })
    .catch(this._error)
}

// start socket listeners
S2FServer.prototype.startListeners = function () {
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

S2FServer.prototype.determineRoles = function (nodes) {
  let scheduler = _.filter(nodes, (node) => (_.includes(node.roles, SCHEDULER) && node.state === ONLINE))
  let tiebreaker = _.filter(nodes, (node) => (_.includes(node.roles, TIEBREAKER) && node.state === ONLINE))
  if (!scheduler.length) return [ SCHEDULER, RUNNER ]
  if (!tiebreaker.length) return [ TIEBREAKER, RUNNER ]
  return [ RUNNER ]
}


export default S2FServer