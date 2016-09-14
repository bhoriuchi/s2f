import _ from 'lodash'
import chalk from 'chalk'
export function createStepRun (backend) {
  let r = backend._r
  let step = backend._db.table(backend._tables.Step.table)
  let table = backend._db.table(backend._tables.StepRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
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
  let r = backend._r
  let table = backend._db.table(backend._tables.StepRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    if (_.isArray(info.path) && info.path.join('.').match(/stepRuns$/) && source && source.id) {
      return table.filter({ workflowRunThread: source.id }).run(connection)
    }
    console.log(source)
    if (source && source.currentStepRun) {
      console.log('here2')
      return table.get(source.currentStepRun).run(connection)
    }
    if (args.id) return table.filter({ id: args.id }).run(connection)
    return table.run(connection)
  }
}

export function updateStepRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.StepRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('StepRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteStepRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.StepRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('StepRun not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createStepRun,
  readStepRun,
  updateStepRun,
  deleteStepRun
}