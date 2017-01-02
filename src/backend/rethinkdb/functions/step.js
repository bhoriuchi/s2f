import _ from 'lodash'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'

let { values: { WORKFLOW, TASK } } = StepTypeEnum

export function readStepThreads (backend) {
  return function (source = {}, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getCollection('Step')

    switch (source.type) {
      case 'FORK':
        return table.filter({ fork: source.id }).run(connection)
      default:
        return []
    }
  }
}

export function readSource (backend) {
  return function (source = {}, args, context = {}, info) {
    let {r, connection} = backend
    let { temporalFilter } = this.globals._temporal
    let taskId = _.get(source, 'task') || _.get(source, 'task.id') || null

    // if not a workflow or task, simply return the source
    if (source.type !== TASK) return _.get(source, 'source', null)

    let vargs = _.keys(source.versionArgs).length ? source.versionArgs :
      _.merge(_.omit(context, ['id', 'recordId']), { recordId: taskId })

    return temporalFilter('Task', vargs)
      .coerceTo('array')
      .do((t) => {
        return t.count().eq(0).branch(
          null,
          t.nth(0).hasFields('source').branch(
            t.nth(0)('source'),
            null
          )
        )
      })
      .run(connection)
  }
}

export function readStepParams (backend) {
  return function (source = {}, args, context = {}, info) {
    let { r, connection } = backend
    let { temporalFilter } = this.globals._temporal
    let parameter = backend.getCollection('Parameter')
    context = _.omit(context, ['recordId', 'id'])

    return r.expr(source).do((s) => {
      return r.expr([WORKFLOW, TASK]).contains(s('type')).branch(
        s.hasFields('versionArgs').branch(
          s('versionArgs').keys().count().ne(0).branch(
            s('versionArgs'),
            r.expr(context)
          ),
          r.expr(context)
        )
          .do((vargs) => {
            return r.branch(
              s('type').eq(WORKFLOW).and(s.hasFields('subWorkflow')),
              temporalFilter('Workflow', vargs.merge({recordId: s('subWorkflow')})),
              s('type').eq(TASK).and(s.hasFields('task')),
              temporalFilter('Task', vargs.merge({recordId: s('task')})),
              r.error('Temporal relation missing reference')
            )
              .coerceTo('array')
              .do((recs) => {
                return recs.count().eq(0).branch(
                  null,
                  recs.nth(0)('id')
                )
              })
          }),
        s('id')
      )
        .do((id) => parameter.filter({parentId: id }).coerceTo('array'))
    })
      .run(connection)
  }
}

export default {
  readStepThreads,
  readSource,
  readStepParams
}