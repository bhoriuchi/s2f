import _ from 'lodash'
import { getStepRun, setStepRunStatus } from '../query'
import nextStepRun from './nextStepRun'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { SUCCESS, WAITING } } = RunStatusEnum

export default function resumeStep (backend, stepRunId, done) {
  try {
    return getStepRun(backend, stepRunId, (err, stepRun) => {
      let status = _.get(stepRun, 'status')
      let thread = _.get(stepRun, 'thread.id')
      let workflowRun = _.get(stepRun, 'thread.workflowRun.id')
      let nextStep = _.get(stepRun, 'step.success')
      let async = _.get(stepRun, 'step.async', false)

      if (err) return done(err)
      if (!stepRun) return done(new Error('invalid step run'))
      if (!nextStep) return done(new Error('attempting to resume a step with no success path'))
      if (!thread || !workflowRun) return done(new Error('unable to retrieve workflow run and/or thread info'))
      if (status !== WAITING) return done(new Error(`invalid step run status ${status}, must be ${WAITING}`))

      return setStepRunStatus(backend, stepRunId, SUCCESS, (err) => {
        if (err) return done(err)

        return nextStepRun.call(backend, { thread, workflowRun, nextStep, async }, done)
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