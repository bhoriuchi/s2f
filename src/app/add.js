import chalk from 'chalk'

export default function (lib, helper) {
  let { error, pretty, options: { host, port, role } } = helper

  let args = []
  if (!host) error('Add operation requires a host option')
  if (port) args.push(`port: ${port}`)
  if (role) args.push(`defaultRole: ${role}`)
  args.push(`host: "${host}"`)

  lib.ClusterNode(`mutation Mutation {
  createClusterNode (
    ${args.join(', ')}
  ) {
    id,
    host,
    port,
    defaultRole,
    roles,
    state
  }
}`)
    .then((res) => {
      if (res.errors) return error(pretty(res.errors))
      console.log(chalk.green.bold('Added Node:'))
      console.log(chalk.green(pretty(res, 'data.createClusterNode')))
      process.exit()
    })
    .catch(error)
}