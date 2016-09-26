import _ from 'lodash'

export function createStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let step = backend.getTypeCollection('Step')
    let table = backend.getTypeCollection('StepRun')

    return step.get(args.step).eq(null).branch(
      r.error(`Step ${args.step} not found`),
      table.insert({
        step: args.step,
        started: r.now(),
        status: 'RUNNING',
        workflowRunThread: args.workflowRunThread
      }, { returnChanges: true })('changes')
        .nth(0)('new_val')
    )
      .run(connection)
  }
}

export function readStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('StepRun')

    if (_.isArray(info.path) && info.path.join('.').match(/stepRuns$/) && source && source.id) {
      return table.filter({ workflowRunThread: source.id }).run(connection)
    }
    if (source && source.currentStepRun) {
      return table.get(source.currentStepRun).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('StepRun')

    return table.get(args.id).eq(null).branch(
      r.error('StepRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('StepRun')

    return table.get(args.id).eq(null).branch(
      r.error('StepRun not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export function startStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('StepRun')

    args.started = r.now()
    args.status = 'RUNNING'

    return table.get(args.id).do((stepRun) => {
      return stepRun.eq(null).branch(
        r.error('StepRun not found'),
        stepRun('status').ne('CREATED').branch(
          r.error('StepRun is not in a state that can be started'),
          table.get(args.id).update(_.omit(args, 'id'))
            .do(() => true)
        )
      )
    })
      .run(connection)
  }
}

export function endStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('StepRun')

    args.ended = r.now()

    return table.get(args.id).eq(null).branch(
      r.error('StepRun not found'),
      table.get(args.id).update(_.omit(args, ['id', 'success']))
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createStepRun,
  readStepRun,
  updateStepRun,
  deleteStepRun,
  startStepRun,
  endStepRun
}