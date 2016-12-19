import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'

let { values: { INPUT } } = ParameterClassEnum

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

export function first (seq, err = null) {
  return seq.coerceTo('array').do((records) => {
    return records.count().eq(0).branch(
      err,
      records.nth(0)
    )
  })
}

export function now (backend) {
  return function () {
    return backend._r.now().run(backend._connection)
  }
}

export function getWorkflowInputs (step, parameter, workflowId) {
  return step.filter({ workflowId })
    .map((s) => parameter.filter({
      parentId: s('id'),
      class: INPUT
    })
      .filter((param) => {
        return param.hasFields('mapsTo').branch(
          param('mapsTo').eq(null).or(param('mapsTo').eq('')),
          true
        )
      })
      .coerceTo('array'))
    .reduce((left, right) => left.union(right))
}

export default {
  first,
  isPublished,
  now,
  getWorkflowInputs
}