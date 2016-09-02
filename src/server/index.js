import _ from 'lodash'
import http from 'http'
import SocketServer from 'socket.io'
import StateEnum from '../graphql/types/ClusterNodeStateEnum'
import RoleEnum from '../graphql/types/ClusterNodeRoleEnum'
import determineRoles from './determineRoles'
import getNodeConfig from './getNodeConfig'
import heartbeat from './heartbeat'
import offlineNode from './offlineNode'
import promoteScheduler from './promoteScheduler'
import startListeners from './startListeners'

// enums
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
  this._port = Number(port)
  this._app = http.createServer(handler)
  this._app.listen(port)
  this._io = new SocketServer(this._app)
  this._hbInterval = 5000
  this._hbTimeout = 5000

  console.log(`* Starting s2f server on ${host}:${port}`)

  return this.getNodeConfig((err, nodes, config) => {
    this._id = config.id
    this._roles = this.determineRoles(nodes)
    if (_.includes(this._roles, SCHEDULER)) this.promoteScheduler(this._id, this._roles)
    this.startListeners()
    this.heartbeat()
  })
}

S2FServer.prototype.determineRoles = determineRoles
S2FServer.prototype.getNodeConfig = getNodeConfig
S2FServer.prototype.heartbeat = heartbeat
S2FServer.prototype.offlineNode = offlineNode
S2FServer.prototype.promoteScheduler = promoteScheduler
S2FServer.prototype.startListeners = startListeners

export default S2FServer