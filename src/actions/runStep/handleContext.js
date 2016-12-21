import _ from 'lodash'
import endWorkflow from './endWorkflow'
import nextStepRun from './nextStepRun'
import { convertType } from '../common'
import { updateAttributeValues, setStepRunStatus } from '../query'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'
import ParameterClassEnum from '../../graphql/types/ParameterClassEnum'
import StepTypeEnum from '../../graphql/types/StepTypeEnum'

let { values: { SUCCESS, FAIL, WAITING } } = RunStatusEnum
let { values: { OUTPUT, ATTRIBUTE } } = ParameterClassEnum
let { values: { CONDITION, LOOP } } = StepTypeEnum

export default function handleContext (payload, done) {
  return (ctx) => {
    try {
      let outputs = []
      let { runner, workflowRun, thread, endStep, localCtx, context, args, step, stepRunId, resume } = payload
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

      return updateAttributeValues(this, outputs, (err) => {
        if (err) return done(err)

        if (step.waitOnSuccess && status === SUCCESS && !resume) {
          return setStepRunStatus(this, stepRunId, WAITING, (err) => {
            if (err) return done(err)
            done()
          })
        }

        return setStepRunStatus(this, stepRunId, status, (err) => {
          if (err) return done(err)

          if (nextStep === endStep) return endWorkflow.call(this, payload, done)
          else if (!async) return nextStepRun.call(this, { thread, workflowRun, nextStep, async }, done)
          return done()
        })
      })
    } catch (error) {
      this.log.error({
        errors: error.message || error,
        stack: error.stack
      }, 'Failed to handle context')
      done(error)
    }
  }
}