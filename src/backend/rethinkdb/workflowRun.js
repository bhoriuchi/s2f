import _ from 'lodash'
import { convertType, isNested } from '../../actions/common'
import chalk from 'chalk'
export function createWorkflowRun (backend) {
  let r = backend._r
  let workflowRun = backend._db.table(backend._tables.WorkflowRun.table)
  let parameterRun = backend._db.table(backend._tables.ParameterRun.table)
  let stepRun = backend._db.table(backend._tables.StepRun.table)
  let workflowRunThread = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return r.do(r.now(), r.uuid(), r.uuid(), r.uuid(), (now, workflowRunId, stepRunId, workflowRunThreadId) => {
        return workflowRun.insert({
          id: workflowRunId,
          workflow: args.workflow,
          args: args.args,
          input: args.input,
          started: now,
          status: 'RUNNING'
        }, { returnChanges: true })('changes')
          .nth(0)('new_val')
          .do((wfRun) => {
            return workflowRunThread.insert({
              id: workflowRunThreadId,
              workflowRun: workflowRunId,
              currentStepRun: stepRunId,
              status: 'CREATED'
            })
              .do(() => {
                if (!args.parameters.length) return
                return parameterRun.insert(_.map(args.parameters, (param) => {
                  return {
                    parameter: param.id,
                    parentId: workflowRunId,
                    class: param.class,
                    value: _.get(param, 'defaultValue')
                  }
                }))
              })
              .do(() => {
                return stepRun.insert({
                  id: stepRunId,
                  workflowRunThread: workflowRunThreadId,
                  step: args.step.id,
                  started: now,
                  status: 'CREATED'
                })
              })
              .do(() => {
                if (!args.step.parameters.length) return
                let p = []
                // map the input and attributes to the local step params
                _.forEach(args.step.parameters, (param) => {
                  let paramValue = null
                  if (param.mapsTo) {
                    paramValue = _.get(_.find(args.parameters, { id: param.mapsTo }), 'defaultValue')
                  } else if (!param.mapsTo && _.has(args.input, param.name)) {
                    try {
                      paramValue = convertType(param.type, param.name, _.get(args.input, param.name))
                    } catch (err) {}
                  }
                  p.push({
                    parameter: param.id,
                    parentId: stepRunId,
                    class: param.class,
                    value: paramValue
                  })
                })
                return parameterRun.insert(p)
              })
              .do(() => wfRun)
          })
      })
      .run(connection)
  }
}

export function readWorkflowRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.WorkflowRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    let filter = table
    if (args.id) {
      filter = filter.get(args.id)
        .do((result) => {
          return result.eq(null).branch(
            [],
            r.expr([result])
          )
        })
    }
    return filter.run(connection)
  }
}

export function updateWorkflowRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.WorkflowRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteWorkflowRun (backend) {
  let r = backend._r
  let table = backend._db.table(backend._tables.WorkflowRun.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRun not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}


export default {
  createWorkflowRun,
  readWorkflowRun,
  updateWorkflowRun,
  deleteWorkflowRun
}