import _ from 'lodash'
import { gqlResult } from '../common'
import computeWorkflowStatus from './computeWorkflowStatus'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { CREATED, FORKING, JOINING, ENDING, RUNNING, JOINED } } = RunStatusEnum
let RUNNING_STATES = [ CREATED, FORKING, JOINING, RUNNING ]

// tie breaker function, looks for ending threads
// if multiple found, sorts the ids and takes the first
// as the tie breaker
export function winTieBreak (thread, ending) {
  if (!_.without(ending, thread).length) return true
  return ending.sort()[0] === thread
}


export default function endWorkflow (payload, done) {
  let { workflowRun, thread } = payload

  return this.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread (id: "${thread}", status: ${ENDING})
    { id }
  }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err

      return this.lib.S2FWorkflow(`{ readWorkflowRun (id: "${workflowRun}") { threads { id, status } } }`)
        .then((result) => gqlResult(this, result, (err, data) => {
          if (err) throw err

          let [ ending, running ] = [ [], [] ]
          _.forEach(_.get(data, 'readWorkflowRun[0].threads'), (t) => {
            if (_.includes(RUNNING_STATES, t.status)) running.push(t.id)
            else if (t.status === ENDING) ending.push(t.id)
          })

          // determine if the current call should complete the workflow
          // if there are no running threads and this thread is the only ending thread
          // then it is ok, otherwise if there are multiple ending then a tiebreaker should
          // take place. the tie breaker will be the sorted order of ids.
          if (running.length || !winTieBreak(thread, ending)) {
            return this.lib.S2FWorkflow(`mutation Mutation {
              updateWorkflowRunThread (id: "${thread}", status: ${JOINED})
              { id }
            }`)
              .then((result) => gqlResult(this, result, (err, data) => {
                if (err) throw err
                return done()
              }))
          }

          // compute end of workflow
          return computeWorkflowStatus.call(this, payload, done)
        }))
    }))
    .catch((error) => {
      this.log.error({ error, thread, workflowRun }, 'failed to end workflow or thread')
      done(error)
    })
}