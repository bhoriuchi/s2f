import _ from 'lodash'
import setStepStatus from './setStepStatus'
import endWorkflow from './endWorkflow'
import nextStepRun from './nextStepRun'
import { convertType } from '../common'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import ParameterClassEnum from '../../graphql/types/ParameterClassEnum'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'
let { values: { SUCCESS, FAIL } } = RunStatusEnum
let { values: { OUTPUT, ATTRIBUTE } } = ParameterClassEnum
let { values: { CONDITION, LOOP } } = StepTypeEnum

export default function handleContext (payload, done) {
  return (ctx) => {

    let { toObjectString } = this.factory.utils
    let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId } = payload
    let { async, source, timeout, failsWorkflow, waitOnSuccess, success, fail, parameters } = step
    fail = fail || endStep

    let failed = ctx._exception || ctx._result === false
    let nextStep = failed ? fail : success
    let status = failed ? FAIL : SUCCESS

    switch (step.type) {
      case CONDITION:
        status = SUCCESS
        break
      case LOOP:
        status = SUCCESS
        break
      default:
        break
    }

    // generate value changes to push
    let outputs = []
    _.forEach(parameters, (param) => {
      if (param.class === OUTPUT && _.has(ctx, param.name) && _.has(param, 'mapsTo')) {
        try {
          let target = _.find(context, { parameter: { id: param.mapsTo, class: ATTRIBUTE } })
          if (!target) return

          outputs.push({
            id: target.id,
            value: convertType(param.type, param.name, _.get(ctx, param.name))
          })
        } catch (error) {
          this.log.warn({ error }, 'type conversion failed so value will not be set')
        }
      }
    })

    return this.lib.S2FWorkflow(`mutation Mutation {
      updateAttributeValues (values: ${toObjectString(outputs)})
    }`)
      .then(() => {
        return setStepStatus.call(this, stepRunId, status)
          .then(() => {
            if (nextStep === endStep) return endWorkflow.call(this, payload, done)
            else if (!async) return nextStepRun.call(this, { thread, workflowRun, nextStep, async }, done)
            done()
          })
      })
  }
}