import _ from 'lodash'
import { winTieBreak } from '../common'
import { updateWorkflowRunThread, getRunThreads } from '../query'
import computeWorkflowStatus from './computeWorkflowStatus'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { CREATED, FORKING, JOINING, ENDING, RUNNING, JOINED } } = RunStatusEnum
let RUNNING_STATES = [ CREATED, FORKING, JOINING, RUNNING ]

export default function endWorkflow (payload, done) {
  try {
    let { workflowRun, thread } = payload
    let [ ending, running ] = [ [], [] ]

    return updateWorkflowRunThread(this, { id: thread, status: `Enum::${ENDING}` }, (err) => {
      if (err) return done(err)

      return getRunThreads(this, workflowRun, (err, threads) => {
        if (err) return done(err)

        _.forEach(threads, (t) => {
          if (_.includes(RUNNING_STATES, t.status)) running.push(t.id)
          else if (t.status === ENDING) ending.push(t.id)
        })

        // determine if the current call should complete the workflow
        // if there are no running threads and this thread is the only ending thread
        // then it is ok, otherwise if there are multiple ending then a tiebreaker should
        // take place. the tie breaker will be the sorted order of ids.
        if (running.length || !winTieBreak(thread, ending)) {
          return updateWorkflowRunThread(this, { id: thread, status: `Enum::${JOINED}` }, (err) => {
            if (err) return done(err)
            return done()
          })
        }
        return computeWorkflowStatus.call(this, payload, done)
      })
    })
  } catch (error) {
    this.log.error({
      errors: error.message || error,
      stack: error.stack
    }, 'Failed to end workflow')
    done(error)
  }
}