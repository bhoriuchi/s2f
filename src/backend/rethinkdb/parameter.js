import _ from 'lodash'

export function create (backend, type, args) {
  let r = backend._r
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let step = backend._db.table(backend._tables.Step.table)
  let connection = backend._connection

  let vars = {
    GLOBAL: {
      id: args.workflowId,
      idKey: 'workflowId',
      table: workflow
    },
    INPUT: {
      id: args.stepId,
      idKey: 'stepId',
      table: step
    },
    OUTPUT: {
      id: args.stepId,
      idKey: 'stepId',
      table: step
    }
  }
  let { id, idKey, table } = vars[type]
  args.scope = type
  args.mutable = true

  return table.get(id)
    .merge((obj) => {
      return { parameters: obj('parameters').map((parameterId) => r.table('parameters').get(parameterId)) }
    })
    .do((obj) => {
      return r.branch(
        obj('parameters')('name').map((name) => name.downcase()).contains(r.expr(args.name).downcase()),
        r.error(`A parameter with the name ${args.name} already exists on the current ${type}`),
        parameter.insert(_.omit(args, idKey), { returnChanges: true })('changes')
          .nth(0)('new_val')
          .do((p) => {
            return table.get(id).update((orig) => {
              return {
                parameters: orig('parameters').append(p('id'))
              }
            })
              .do(() => p)
          })
      )
    })
    .run(connection)

}

export function createGlobalParameter (backend) {
  return function (source, args, context, info) {
    return create(backend, 'GLOBAL', args)
  }
}

export function createInputParameter (backend) {
  return function (source, args, context, info) {
    return create(backend, 'INPUT', args)
  }
}

export function createOutputParameter (backend) {
  return function (source, args, context, info) {
    return create(backend, 'OUTPUT', args)
  }
}

export function read (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection
  return function (source, args, context, info) {
    let { isNested } = this.globals._temporal
    if (isNested(source)) {
      if (_.isObject(_.get(source, 'parameters[0]'))) return source.parameters
      return table.filter((parameter) => r.expr(source.parameters).contains(parameter('id'))).run(connection)
    }
    return table.run(connection)
  }
}

export function update (backend, args) {
  let r = backend._r
  let table = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection

  return r.branch(
    table.get(args.id)('mutable').eq(false),
    r.error('The parameter belongs to a published record and can no longer be modified'),
    table.get(args.id).update(_.omit(args, 'id'))
      .do(() => table.get(args.id))
  )
    .run(connection)
}

export function updateGlobalParameter (backend) {
  return function (source, args, context, info) {
    return update(backend, args)
  }
}

export function updateLocalParameter (backend) {
  return function (source, args, context, info) {
    return update(backend, args)
  }
}

export function del (backend, type, args) {
  let r = backend._r
  let workflow = backend._db.table(backend._tables.Workflow.table)
  let step = backend._db.table(backend._tables.Step.table)
  let parameter = backend._db.table(backend._tables.Parameter.table)
  let connection = backend._connection
  let vars = {
    GLOBAL: {
      id: args.workflowId,
      table: workflow
    },
    LOCAL: {
      id: args.stepId,
      table: step
    }
  }

  let { id, table } = vars[type]

  return r.branch(
    parameter.get(args.id)('mutable').eq(false),
    r.error('The parameter belongs to a published record and can not be deleted'),
    table.get(id).update((orig) => {
      return {
        parameters: orig('parameters').without(args.id)
      }
    })
      .do(() => true)
  )
    .run(connection)
}

export function deleteGlobalParameter (backend) {
  return function (source, args, context, info) {
    return del(backend, 'GLOBAL', args)
  }
}

export function deleteLocalParameter (backend) {
  return function (source, args, context, info) {
    return del(backend, 'LOCAL', args)
  }
}



export default {
  createGlobalParameter,
  createInputParameter,
  createOutputParameter,
  read,
  updateGlobalParameter,
  updateLocalParameter,
  deleteGlobalParameter,
  deleteLocalParameter
}