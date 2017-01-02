export function readTaskVersions (backend) {
  return function (source, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getCollection('Task')
    let filter = table.filter({ _temporal: { recordId: args.recordId } })
    if (args.offset) filter = filter.skip(args.offset)
    if (args.limit) filter = filter.limit(args.limit)
    return filter.run(connection)
  }
}

export default {
  readTaskVersions
}