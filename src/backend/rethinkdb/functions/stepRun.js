import _ from 'lodash'
import RunStatusEnum from '../../../graphql/types/RunStatusEnum'
import StepTypeEnum from '../../../graphql/types/StepTypeEnum'
import ParameterClassEnum from '../../../graphql/types/ParameterClassEnum'
let { values: { INPUT } } = ParameterClassEnum
let { values: { FORKED, CREATED, RUNNING } } = RunStatusEnum
let { values: { FORK } } = StepTypeEnum


export function newStepRun (backend, args, id, returnChanges = true, checkThread = true) {
  let { r } = backend
  let thread = backend.getTypeCollection('WorkflowRunThread')
  let step = backend.getTypeCollection('Step')
  let stepRun = backend.getTypeCollection('StepRun')
  let parameterRun = backend.getTypeCollection('ParameterRun')
  let parameter = backend.getTypeCollection('Parameter')
  let workflowRun = backend.getTypeCollection('WorkflowRun')

  // verify the step is valid
  return step.get(args.step)

  // generate an error message if not valid or stepRun uuid if valid
    .do((_step) => _step.eq(null).branch(r.error('Step does not exist'), id))
    .do((stepRunId) => {
      return thread.get(args.workflowRunThread)

      // verify the thread exists
        .do((_thread) => {
          return _thread.eq(null)
            .and(r.expr(checkThread).eq(true))
            .branch(
              r.error('Workflow Run Thread not found'),
              r.expr(args).hasFields('workflowRun').branch(
                r.expr(args)('workflowRun'),
                _thread('workflowRun')
              )
                .do((wfRunId) => wfRunId.eq(null).branch(r.error('Unable to determine workflow run ID'), wfRunId))
            )
        })
        .do((wfRunId) => {

          // get the workflowRun for its input
          return workflowRun.get(wfRunId)
            .do((wfRun) => {
              return wfRun.eq(null).branch(
                r.error('WorkflowRun not found'),
                parameter.filter({ parentId: args.step, class: INPUT })
                  .coerceTo('array')
                  .map((_param) => {
                    return {
                      parameter: _param('id'),
                      parentId: stepRunId,
                      value: _param.hasFields('mapsTo')
                        .and(_param('mapsTo').ne(null))
                        .branch(
                          parameterRun.filter({ parentId: wfRunId, parameter: _param('mapsTo') })
                            .coerceTo('array')
                            .do((ctxParam) => {
                              return ctxParam.count().gt(0).branch(
                                ctxParam.nth(0)('value'),
                                wfRun('input').hasFields(_param('name')).branch(
                                  wfRun('input')(_param('name')),
                                  _param.hasFields('defaultValue').branch(
                                    _param('defaultValue'),
                                    null
                                  )
                                )
                              )
                            }),
                          wfRun('input').hasFields(_param('name')).branch(
                            wfRun('input')(_param('name')),
                            _param.hasFields('defaultValue').branch(
                              _param('defaultValue'),
                              null
                            )
                          )
                        )
                    }
                  })
                  .do((paramRuns) => parameterRun.insert(paramRuns))
                  .do(() => {
                    return stepRun.insert({
                      id: stepRunId,
                      workflowRunThread: args.workflowRunThread,
                      step: args.step,
                      started: r.now(),
                      status: CREATED
                    }, { returnChanges })
                  })
              )
            })
        })
    })
}

/*

Args:

step (id),
workflowRunThread (id)
input (JSON)

 */
export function createStepRun (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    return newStepRun(backend, args, r.uuid())('changes')
      .nth(0)('new_val')
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
    args.status = RUNNING

    return table.get(args.id).do((stepRun) => {
      return stepRun.eq(null).branch(
        r.error('StepRun not found'),
        stepRun('status').ne(CREATED).branch(
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
      table.get(args.id).update(_.omit(args, 'id'))
        .do(() => true)
    )
      .run(connection)
  }
}

export function createForks (backend) {
  return function (source, args, context, info) {
    let { r, connection } = backend
    let workflowRun = backend.getTypeCollection('WorkflowRun')
    let thread = backend.getTypeCollection('WorkflowRunThread')
    let step = backend.getTypeCollection('Step')

    return workflowRun.get(args.workflowRun)
      .do((wfRun) => wfRun.eq(null).branch(r.error('Workflow run does not exist'), wfRun))
      .do(() => {
        return step.get(args.step)
          .do((s) => {
            return s.eq(null).branch(
              r.error('Step does not exist'),
              s('type').ne(FORK).branch(
                r.error('Step is not a FORK'),
                step.filter({ fork: s('id') })
                  .coerceTo('array')
                  .map((forked) => {
                    return {
                      threadId: r.uuid(),
                      stepRunId: r.uuid(),
                      step: forked('id')
                    }
                  })
                  .do((val) => {
                    return val.forEach((v) => {
                      return newStepRun(backend, {
                        workflowRun: args.workflowRun,
                        step: v('step'),
                        workflowRunThread: v('threadId')
                      }, v('stepRunId'), false, false)
                    })
                      .do(() => {
                        return thread.get(args.workflowRunThread)
                          .do((parentThread) => {
                            return parentThread.eq(null)
                              .branch(
                                r.error('Parent thread does not exist'),
                                thread.get(args.workflowRunThread).update({ status: FORKED })
                              )
                          })
                      })
                      .do(() => {
                        return val.map((v) => {
                          return {
                            id: v('threadId'),
                            workflowRun: args.workflowRun,
                            currentStepRun: v('stepRunId'),
                            status: CREATED,
                            parentThread: args.workflowRunThread
                          }
                        })
                          .coerceTo('array')
                          .do((d) => {
                            return thread.insert(d, { returnChanges: true })('changes')('new_val')
                          })
                      })
                  })
              )
            )
          })
      })
      .run(connection)
  }
}

export default {
  createStepRun,
  readStepRun,
  updateStepRun,
  deleteStepRun,
  startStepRun,
  endStepRun,
  createForks
}