import _ from 'lodash'
import { convertType, isNested } from '../../../actions/common'

export function createWorkflowRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let workflowRun = backend.getTypeCollection('WorkflowRun')
    let parameterRun = backend.getTypeCollection('ParameterRun')
    let stepRun = backend.getTypeCollection('StepRun')
    let workflowRunThread = backend.getTypeCollection('WorkflowRunThread')

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
                if (!args.parameters || !args.parameters.length) return null
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
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRun')

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
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRun')

    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => table.get(args.id))
    )
      .run(connection)
  }
}

export function deleteWorkflowRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getTypeCollection('WorkflowRun')

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