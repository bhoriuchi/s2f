import GetOpt from 'node-getopt'

export default function () {
  let getopt = new GetOpt([
    ['', 'config=ARG', 'Configuration file'],
    ['', 'add', 'Adds a new node'],
    ['', 'remove', 'Removes an existing node'],
    ['', 'update', 'Update node configuration'],
    ['', 'start', 'Start the server'],
    ['', 'cmd=ARG', 'Sends a command'],
    ['h', 'host=ARG', 'Host name or IP'],
    ['p', 'port=ARG', 'Port number (default 8080)'],
    ['r', 'role=ARG', 'Assigns a role']
  ])

  getopt.setHelp(`
Usage: s2fcli [operation] [command | options...]
  operation:
    --add       : adds a new node
    --remove    : removes an existing node
    --update    : updates an existing node
    --start     : starts a node
    --cmd       : sends a command
  options:
    -h --host   : host name or ip
    -p --port   : host port (default 8080)
    -r --role   : assigns a role
  commands:
    stop        : stops node
    restart     : restarts node
    info        : prints info about node
    list        : prints cluster node config
    changerole  : changes node role
    maintenance : pust node into maintenance
`)
  return getopt
}