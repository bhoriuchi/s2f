import _ from 'lodash'
import chalk from 'chalk'
import { GraphQLError } from 'graphql/error'
import { isPublished } from './common'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'

let { values: { WORKFLOW, TASK } } = StepTypeEnum

export function destroyStep (backend, ids) {
  let { r, connection } = backend
  let step = backend.getTypeCollection('Step')
  let parameter = backend.getTypeCollection('Parameter')

  ids = _.isString(ids) ? [ids] : ids
  return step.filter((s) => r.expr(ids).contains(s('id')))
    .delete()
    .do(() => {
      return parameter.filter((p) => r.expr(ids).contains(p('parentId')))
        .delete()
    })
    .do(() => true)
}

export function createStep (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let parameter = backend.getTypeCollection('Parameter')
    let workflow = backend.getTypeCollection('Workflow')

    let { createTemporalStep, filterTemporalTask } = this.globals._temporal

    if (_.includes(['START', 'END'], args.type)) {
      throw new GraphQLError(`A ${args.type} type can only be added during new workflow creation`)
    }
    if (args.type === 'TASK' && !args.task) {
      throw new GraphQLError(`A step of type TASK must specifiy a published tasks recordId`)
    }
    args.entityType = 'STEP'

    return workflow.get(args.workflowId)
      .eq(null)
      .branch(
        r.error(`Workflow ${args.workflowId} does not exist`),
        r.expr(args.type).ne('TASK').branch(
          createTemporalStep(args)('changes').nth(0)('new_val'),
          filterTemporalTask({ recordId: args.task })
            .coerceTo('array')
            .do((task) => {
              return task.count().eq(0).branch(
                r.error('The task specified does not have a current published version'),
                createTemporalStep(r.expr(args).merge({ source: task.nth(0)('source') }))('changes').nth(0)('new_val')
              )
            })
        )
      )
      .run(connection)
      .then((step) => {
        if (args.type !== 'TASK') return step

        // copy the current task parameters to the step
        // since it is required that the step already be published there is no need
        // to keep the parameters synced between the step and task
        return filterTemporalTask({ recordId: args.task })
          .nth(0)('id')
          .do((taskId) => {
            return parameter.filter({ parentId: taskId })
              .map((param) => param.merge({ id: r.uuid(), scope: 'STEP', parentId: step.id }))
              .forEach((p) => parameter.insert(p))
              .do(() => step)
          })
          .run(connection)
      })
  }
}

export function readStepThreads (backend) {
  return function (source = {}, args, context = {}, info) {
    let {r, connection} = backend
    let table = backend.getTypeCollection('Step')

    switch (source.type) {
      case 'FORK':
        return table.filter({ fork: source.id }).run(connection)
      default:
        return []
    }
  }
}

export function readStep (backend) {
  return function (source = {}, args, context = {}, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Step')

    let { filterTemporalStep } = this.globals._temporal
    context.date = args.date || context.date

    if (source.step) return table.get(source.step).run(connection)

    let filter = filterTemporalStep(args)

    if (source.id) {
      filter = table.filter({ workflowId: source.id })
      if (args.first) {
        filter = filter.filter({ type: 'START' })
          .nth(0)
          .do((start) => {
            return table.get(start('success'))
              .count()
              .eq(0)
              .branch(
                r.expr([]),
                r.expr([table.get(start('success'))])
              )
          })
      }
    }

    return filter.coerceTo('array').run(connection)
  }
}

export function updateStep (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('Step')

    return isPublished(backend, 'Step', args.id).branch(
      r.error('This step is published and cannot be modified'),
      table.get(args.id)
        .update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteStep (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend

    return isPublished(backend, 'Step', args.id).branch(
      r.error('This step is published and cannot be deleted'),
      destroyStep(backend, args.id)
    )
      .run(connection)
  }
}

export function readSource (backend) {
  return function (source = {}, args, context = {}, info) {
    let {r, connection} = backend
    let { filterTemporalTask } = this.globals._temporal

    // if not a workflow or task, simply return the source
    if (source.type !== TASK) return _.get(source, 'source', null)

    let vargs = _.keys(source.versionArgs).length ? source.versionArgs :
      _.merge(_.omit(context, ['id', 'recordId']), { recordId: _.get(source, 'task', null) })

    return filterTemporalTask(vargs)
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
    let {r, connection} = backend
    let {filterTemporalWorkflow, filterTemporalTask} = this.globals._temporal
    let parameter = backend.getTypeCollection('Parameter')
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
              filterTemporalWorkflow(vargs.merge({recordId: s('subWorkflow')})),
              s('type').eq(TASK).and(s.hasFields('task')),
              filterTemporalTask(vargs.merge({recordId: s('task')})),
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
  destroyStep,
  createStep,
  readStep,
  updateStep,
  deleteStep,
  readStepThreads,
  readSource,
  readStepParams
}