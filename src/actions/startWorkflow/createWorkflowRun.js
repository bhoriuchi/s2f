import _ from 'lodash'
import chalk from 'chalk'
import factory from 'graphql-factory'
import { gqlResult } from '../common'
import runStep from '../runStep/index'
let { toObjectString, Enum } = factory.utils

export default function createWorkflowRun (runner, context, done, wf) {
  let { args, input } = context
  let step = wf.steps[0]

  // convert enums
  step.type = Enum(step.type)
  _.forEach(step.parameters, (param) => {
    param.class = Enum(param.class)
    param.type = Enum(param.type)
  })
  _.forEach(wf.parameters, (param) => {
    param.class = Enum(param.class)
    param.type = Enum(param.type)
  })

  let params = {
    workflow: wf.id,
    args,
    input,
    parameters: wf.parameters,
    step
  }

  return this.lib.S2FWorkflow(`mutation Mutation {
    createWorkflowRun (${toObjectString(params, { noOuterBraces: true })}) {
      id,
      threads { id }
    }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err
      let workflowRun = _.get(data, 'createWorkflowRun.id')
      let thread = _.get(data, 'createWorkflowRun.threads[0].id')
      return runStep(this)(runner, { workflowRun, thread }, done)
    }))
    .catch((err) => {
      return done(err)
    })
}