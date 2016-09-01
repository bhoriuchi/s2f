import S2FServer from '../server'
import { DEFAULT_HTTP_PORT } from './common'

export default function (lib, helper) {
  let { error, options: { host, port } } = helper
  helper.options.port = port || DEFAULT_HTTP_PORT
  if (!host) return error('No host option was specified', true)
  if (isNaN(helper.options.port)) return error(`Invalid port value ${helper.options.port}`)
  helper.options.port = Number(helper.options.port)
  return new S2FServer(lib, helper)
}