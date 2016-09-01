import _ from 'lodash'
import chalk from 'chalk'
import SocketClient from 'socket.io-client'

export default function (lib, helper) {
  let { error, pretty, options: { cmd, host, port, role, id } } = helper

  switch (cmd) {
    case 'list':
      return lib.ClusterNode('{ readClusterNode { id, host, port, roles, defaultRole, state } }')
        .then((res) => {
          if (res.errors) return error(pretty(res.errors))
          console.log(chalk.blue.bold('Cluster Nodes:'))
          console.log(chalk.blue(pretty(res.data.readClusterNode)))
          process.exit()
        })
        .catch(error)
    case 'info':
      if (!id) return error('A host ID is required but was not specified')
      return lib.ClusterNode(`{ readClusterNode(id: "${id}") { id, host, port, roles, defaultRole, state } }`)
        .then((res) => {
          let nodeInfo = _.get(res, 'data.readClusterNode[0]')
          if (res.errors) return error(pretty(res.errors))
          if (!nodeInfo) return error(`No node found with ID ${id}`)
          console.log(chalk.blue.bold('Cluster Node:'))
          console.log(chalk.blue(pretty(nodeInfo)))
          process.exit()
        })
        .catch(error)
    case 'status':
      if (!id) return error('A host ID is required but was not specified')
      return lib.ClusterNode(`{ readClusterNode(id: "${id}") { id, host, port, roles, defaultRole, state } }`)
        .then((res) => {
          let nodeInfo = _.get(res, 'data.readClusterNode[0]')
          if (res.errors) return error(pretty(res.errors))
          if (!nodeInfo) return error(`No node found with ID ${id}`)
          let socket = SocketClient(`http://${nodeInfo.host}:${nodeInfo.port}`, { timeout: 2000 })
          socket.on('connected', () => {
            socket.emit('status')
          })
          socket.on('status', (data) => {
            socket.emit('disconnect')
            console.log(chalk.blue.bold('Node Status:'))
            console.log(chalk.blue(pretty(data)))
            process.exit()
          })
          socket.on('connect_error', () => {
            error('Socket connection error, the server may not be listening')
          })
          socket.on('connect_timeout', () => {
            error('Socket connection timeout, the server may not be listening')
          })
        })
        .catch(error)
    default:
      return error(`${cmd} is not a valid command`, true)
  }
}