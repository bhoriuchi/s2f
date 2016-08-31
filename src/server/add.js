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
      if (res.errors) error(pretty(res.errors))
      else console.log(chalk.green(`Added Node\n${pretty(res, 'data.createClusterNode')}`))
      process.exit()
    })
    .catch((err) => {
      error(err)
    })
}