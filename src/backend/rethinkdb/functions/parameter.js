import _ from 'lodash'

export function createParameter (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Parameter')

    if (args.scope === 'WORKFLOW' && (args.class !== 'ATTRIBUTE')) {
      throw new Error('Workflow parameters can only be of class ATTRIBUTE')
    }
    if (_.includes(['WORKFLOW', 'TASK'], args.scope)) args.mapsTo = null
    args.entityType = 'PARAMETER'
    return table.filter({ parentId: args.parentId })('name')
      .coerceTo('array')
      .do((obj) => {
        return r.branch(
          obj.map((name) => name.downcase()).contains(r.expr(args.name).downcase()),
          r.error(`A parameter with the name ${args.name} already exists on the current ${args.scope}`),
          table.insert(args, { returnChanges: true })('changes').nth(0)('new_val')
        )
      })
      .run(connection)
  }
}

export function readParameter (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Parameter')

    if (!source) return table.run(connection)
    if (source.parameter) {
      return table.get(source.parameter).run(connection)
    }
    return table.filter({ parentId: source.id }).run(connection)
  }
}

export function isParentPublished (backend, id) {
  let { r, connection } = backend
  let parameter = backend.getTypeCollection('Parameter')
  let workflow = backend.getTypeCollection('Workflow')
  let step = backend.getTypeCollection('Step')
  let task = backend.getTypeCollection('Task')

  return parameter.get(id).do((param) => {
    return r.branch(
      param.eq(null),
      r.error('Parameter does not exist'),
      r.branch(
        param('scope').eq('WORKFLOW'),
        workflow.get(param('parentId')),
        r.branch(
          param('scope').eq('TASK'),
          task.get(param('parentId')),
          step.get(param('parentId'))
        )
      )
        .do((parent) => {
          return r.branch(
            parent('_temporal')('version').ne(null),
            true,
            false
          )
        })
    )
  })
}

export function updateParameter (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let parameter = backend.getTypeCollection('Parameter')

    return isParentPublished(backend, args.id).branch(
      r.error('This parameter belongs to a published record and cannot be modified'),
      parameter.get(args.id)
        .do((param) => {
          return r.branch(
            r.expr(['WORKFLOW', 'TASK']).contains(param('scope')),
            parameter.get(args.id).update(_.omit(args, 'id', 'mapsTo')).do(() => parameter.get(args.id)),
            parameter.get(args.id).update(_.omit(args, 'id')).do(() => parameter.get(args.id))
          )
        })
    )
      .run(connection)
  }
}

export function deleteParameter (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let parameter = backend.getTypeCollection('Parameter')

    return isParentPublished(backend, args.id).branch(
      r.error('This parameter belongs to a published record and cannot be deleted'),
      parameter.get(args.id)
        .delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createParameter,
  readParameter,
  updateParameter,
  deleteParameter
}