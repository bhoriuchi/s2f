export function isPublished (backend, type, id) {
  let r = backend._r
  let table = backend._db.table(backend._tables[type].table)
  return table.get(id)
    .do((obj) => {
      return r.branch(
        obj.eq(null),
        r.error(`${type} does not exist`),
        r.branch(
          obj('_temporal')('version').ne(null),
          true,
          false
        )
      )
    })
}

export function now (backend) {
  return function () {
    return backend._r.now().run(backend._connection)
  }
}

export default {
  isPublished,
  now
}