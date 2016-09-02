import _ from 'lodash'

export default function getNodeConfig (cb) {
  let host = this._host
  let port = this._port
  return this._lib.ClusterNode('{ readClusterNode { id, host, port, roles, defaultRole, state } }')
    .then((nodes) => {
      let nodeConfigs = _.get(nodes, 'data.readClusterNode', [])
      let config = _.filter(nodeConfigs, { host, port })
      if (nodes.errors) return this._error(this._pretty(nodes.errors))
      if (!config.length) return this._error(`The host:port ${host}:${port} has not been added yet`, true)
      cb(null, nodeConfigs, config[0])
    })
    .catch(this._error)
}