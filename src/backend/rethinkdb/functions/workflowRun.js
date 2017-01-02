import _ from 'lodash'
import { convertType } from '../../../actions/common'
import { first, getWorkflowInputs } from './common'
import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'

let { values: { ATTRIBUTE } } = ParameterClassEnum
let { values: { START, END } } = StepTypeEnum

function firstStep (r, step, workflowId) {
  return first(
    step.filter({ workflowId: workflowId, type: START }),
    r.error('no start step found')
  )
    .do((start) => {
      return step.get(start('success')).do((fstep) => {
        return r.branch(
          fstep.eq(null),
          r.error('no first step found, make sure all steps have connections'),
          fstep('type').eq(END),
          r.error('start is directly connected to end and cannot determine the first step task'),
          fstep
        )
      })
    })
}

export function createWorkflowRun (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let workflowRun = backend.getCollection('WorkflowRun')
    let parameter = backend.getCollection('Parameter')
    let parameterRun = backend.getCollection('ParameterRun')
    let step = backend.getCollection('Step')
    let stepRun = backend.getCollection('StepRun')
    let workflowRunThread = backend.getCollection('WorkflowRunThread')
    let temporalFilter = this.globals._temporal.temporalFilter
    let input = _.isObject(args.input) ? args.input : {}

    // first get the workflow, its inputs, and its first step
    return first(temporalFilter('Workflow', args.args), r.error('wokflow not found'))
      .merge((wf) => {
        return {
          inputs: getWorkflowInputs(step, parameter, wf('id')).coerceTo('array'),
          parameters: parameter.filter({ parentId: wf('id'), class: ATTRIBUTE }).coerceTo('array'),
          step: firstStep(r, step, wf('id'))
            .merge((fstep) => {
              return {
                subWorkflow: fstep.hasFields('subWorkflow')
                  .branch(
                    first(
                      temporalFilter(
                        'Workflow',
                        r.expr(args).merge(() => {
                          return {
                            recordId: fstep('subWorkflow')
                          }
                        }, fstep.hasFields('versionArgs').branch(
                          fstep('versionArgs'),
                          {}
                        ))
                      ),
                      null
                    ),
                    null
                  ),
                  parameters: parameter.filter({ parentId: fstep('id') }).coerceTo('array')
              }
            })
        }
      })
      .run(connection)
      .then((wf) => {
        // check that all required inputs are provided and that the types are correct
        // also convert them at this time using a for loop to allow thrown errors to be
        // caught by promise catch
        for (const i of wf.inputs) {
          if (i.required && !_.has(input, i.name)) throw new Error(`missing required input ${i.name}`)
          if (_.has(input, i.name)) input[i.name] = convertType(i.type, i.name, input[i.name])
        }

        return r.do(r.now(), r.uuid(), r.uuid(), r.uuid(), (now, workflowRunId, stepRunId, workflowRunThreadId) => {
          return workflowRun.insert({
            id: workflowRunId,
            workflow: wf.id,
            args: args.args,
            input: input,
            started: now,
            status: 'RUNNING',
            taskId: args.taskId,
            parentStepRun: args.parent
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
                  if (!_.isArray(wf.parameters) || !wf.parameters.length) return null
                  return parameterRun.insert(_.map(wf.parameters, (param) => {
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
                    step: wf.step.id,
                    status: 'CREATED',
                    taskId: args.taskId
                  })
                })
                .do(() => {
                  if (!wf.step.parameters.length) return null
                  let p = []
                  // map the input and attributes to the local step params
                  _.forEach(wf.step.parameters, (param) => {
                    let paramValue = null
                    if (param.mapsTo) {
                      paramValue = _.get(_.find(wf.parameters, { id: param.mapsTo }), 'defaultValue')
                    } else if (!param.mapsTo && _.has(input, param.name)) {
                      try {
                        paramValue = convertType(param.type, param.name, _.get(input, param.name))
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
      })
  }
}

export function readWorkflowRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let table = backend.getCollection('WorkflowRun')

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
    let table = backend.getCollection('WorkflowRun')

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
    let table = backend.getCollection('WorkflowRun')

    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRun not found'),
      table.get(args.id).delete()
        .do(() => true)
    )
      .run(connection)
  }
}

export function endWorkflowRun (backend) {
  return function (source, args, context, info) {
    let {r, connection} = backend
    let table = backend.getCollection('WorkflowRun')

    args.ended = r.now()

    return table.get(args.id).eq(null).branch(
      r.error('WorkflowRun not found'),
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => true)
    )
      .run(connection)
  }
}

export default {
  createWorkflowRun,
  readWorkflowRun,
  updateWorkflowRun,
  deleteWorkflowRun,
  endWorkflowRun
}