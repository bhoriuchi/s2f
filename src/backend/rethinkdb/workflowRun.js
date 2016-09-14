import _ from 'lodash'
import { convertType } from '../../actions/common'
import chalk from 'chalk'
export function createWorkflowRun (backend) {
  let r = backend._r
  let workflowRun = backend._db.table(backend._tables.WorkflowRun.table)
  let parameterRun = backend._db.table(backend._tables.ParameterRun.table)
  let stepRun = backend._db.table(backend._tables.StepRun.table)
  let workflowRunThread = backend._db.table(backend._tables.WorkflowRunThread.table)
  let connection = backend._connection

  return function (source, args, context, info) {
    console.log(chalk.bgRed.white(JSON.stringify(args, null, '  ')))

    return r.do(r.uuid(), r.uuid(), r.uuid(), (workflowRunId, stepRunId, workflowRunThreadId) => {
        return workflowRun.insert({
          id: workflowRunId,
          workflow: args.workflow,
          args: args.args,
          input: args.input
        }, { returnChanges: true })('changes')
          .nth(0)('new_val')
          .do((wfRun) => {
            return workflowRunThread.insert({ id: workflowRunThreadId, workflowRun: workflowRunId, status: 'CREATED' })
              .do(() => {
                if (!args.parameters.length) return
                return parameterRun.insert(_.map((param) => {
                  return {
                    parameter: param.id,
                    parentId: workflowRunId,
                    class: param.class,
                    value: {
                      value: _.get(param, 'defaultValue')
                    }
                  }
                }))
              })
              .do(() => {
                return stepRun.insert({ id: stepRunId, workflowRunThread: workflowRunThreadId, step: args.step.id })
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
                    value: {
                      value: paramValue
                    }
                  })
                })
                return parameterRun.insert(p)
              })
              .do(() => wfRun)
          })
      })
      .run(connection)
      .then((res) => {
        console.log(chalk.blue(JSON.stringify(res, null, '  ')))
        return res
      })
  }
}


export default {
  createWorkflowRun
}