export function create (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    args.id = r.uuid()
    return table.insert(args).run(connection)
  }
}

export function read (backend) {
  return function (source, args, context, info) {
  }
}

export function update (backend) {
  return function (source, args, context, info) {

  }
}

export function del (backend) {
  return function (source, args, context, info) {

  }
}



export default {
  create,
  read,
  update,
  del
}