import _ from 'lodash'
import http from 'http'
import events from 'events'
import SocketServer from 'socket.io'
import bunyan from 'bunyan'
import determineRoles from './determineRoles'
import getNodeConfig from './getNodeConfig'
import heartbeat from './heartbeat'
import offlineNode from './offlineNode'
import promoteScheduler from './promoteScheduler'
import startListeners from './startListeners'
import {
  SCHEDULER,
  TIEBREAKER,
  RUNNER,
  OFFLINE,
  ONLINE,
  isScheduler,
  isTiebreaker,
  isRunner,
  logLevel
} from './common'

function handler (req, res) {
  res.writeHead(200)
  res.end('ONLINE')
}

// server object constructor
function S2FServer (lib, helper) {
  let { error, pretty, options: { cmd, host, port, role, id, loglevel, logfile } } = helper
  let logStreams = [ { stream: process.stdout, level: logLevel(loglevel) } ]
  if (logfile) logStreams.push({ path: logfile, level: logLevel(loglevel) })
  let logConfig = { name: 'S2F', streams: logStreams }
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
  this._event = new events.EventEmitter()
  this._io = new SocketServer(this._app)
  this._hbInterval = 5000
  this._hbTimeout = 2000
  this._logger = logConfig.level !== 100 ? bunyan.createLogger(logConfig) : false

  this.logInfo(`* Starting s2f server on ${host}:${port}`)

  return this.getNodeConfig((err, nodes, config) => {
    this._id = config.id
    // this._roles = this.determineRoles(nodes)
    // if (_.includes(this._roles, SCHEDULER)) this.promoteScheduler(this._id, this._roles)
    this.startListeners()
    this.heartbeat()
  })
}

S2FServer.prototype.determineRoles = determineRoles
S2FServer.prototype.getNodeConfig = getNodeConfig
S2FServer.prototype.heartbeat = heartbeat
S2FServer.prototype.isScheduler = isScheduler
S2FServer.prototype.isTiebreaker = isTiebreaker
S2FServer.prototype.isRunner = isRunner
S2FServer.prototype.offlineNode = offlineNode
S2FServer.prototype.promoteScheduler = promoteScheduler
S2FServer.prototype.startListeners = startListeners

// logging prototypes
S2FServer.prototype.logFatal = function () {
  if (this._logger) this._logger.fatal.apply(this._logger, arguments)
}
S2FServer.prototype.logError = function () {
  if (this._logger) this._logger.error.apply(this._logger, arguments)
}
S2FServer.prototype.logWarn = function () {
  if (this._logger) this._logger.warn.apply(this._logger, arguments)
}
S2FServer.prototype.logInfo = function () {
  if (this._logger) this._logger.info.apply(this._logger, arguments)
}
S2FServer.prototype.logDebug = function () {
  if (this._logger) this._logger.debug.apply(this._logger, arguments)
}
S2FServer.prototype.logTrace = function () {
  if (this._logger) this._logger.trace.apply(this._logger, arguments)
}

export default S2FServer