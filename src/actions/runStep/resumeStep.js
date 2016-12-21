import _ from 'lodash'
import { getStepRun, setStepRunStatus } from '../query'
import handleContext from './handleContext'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { SUCCESS, WAITING } } = RunStatusEnum

export default function resumeStep (backend, stepRunId, resumeStatus = SUCCESS, localCtx = {}, done) {
  try {
    return getStepRun(backend, stepRunId, (err, stepRun) => {
      if (err) return done(err)

      let status = _.get(stepRun, 'status')
      let thread = _.get(stepRun, 'thread.id')
      let workflowRun = _.get(stepRun, 'thread.workflowRun.id')
      let endStep = _.get(stepRun, 'thread.workflowRun.workflow.endStep.id')
      let context = _.get(stepRun, 'thread.workflowRun.context')
      let args = _.get(stepRun, 'thread.workflowRun.args')
      let step = _.get(stepRun, 'step')
      let nextStep = _.get(step, 'success')
      let async = _.get(step, 'async', false)

      let payload = {
        runner: backend.server,
        workflowRun,
        thread,
        endStep,
        context,
        args,
        step,
        stepRunId,
        resume: true
      }

      if (!thread || !workflowRun) return done(new Error('unable to retrieve workflow run and/or thread info'))
      if (!stepRun) return done(new Error('invalid step run'))
      if (!nextStep) return done(new Error('attempting to resume a step with no success path'))
      if (status !== WAITING) return done(new Error(`invalid step run status ${status}, must be ${WAITING}`))

      return setStepRunStatus(backend, stepRunId, status, (err) => {
        if (err) return done(err)
        return handleContext.call(backend, payload, done)(localCtx)
      })
    })
  } catch (error) {
    backend.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to run source step')
    done(error)
  }
}