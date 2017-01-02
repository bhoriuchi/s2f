import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
let { values: { ATTRIBUTE } } = ParameterClassEnum

export function updateAttributeValues (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let parameterRun = backend.getCollection('ParameterRun')
    let parameter = backend.getCollection('Parameter')

    return r.expr(args.values).forEach((value) => {
      return parameterRun.get(value('id'))
        .do((param) => {
          return param.eq(null).branch(
            r.error('ParameterRun not found'),
            parameter.get(param('parameter'))
              .do((p) => {
                return p.eq(null).or(p('class').ne(ATTRIBUTE)).branch(
                  r.error('Invalid Parameter type'),
                  parameterRun.get(value('id')).update({ value: value('value') })
                )
              })
          )
        })
    })
      .do(() => true)
      .run(connection)
  }
}

export default {
  updateAttributeValues
}