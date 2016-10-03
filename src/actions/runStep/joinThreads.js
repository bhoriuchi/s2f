import _ from 'lodash'
import { gqlResult, winTieBreak } from '../common'
import computeWorkflowStatus from './computeWorkflowStatus'
import RunStatusEnum from '../../graphql/types/RunStatusEnum'

let { values: { CREATED, FORKING, JOINING, ENDING, RUNNING, JOINED } } = RunStatusEnum
let RUNNING_STATES = [ CREATED, FORKING, JOINING, RUNNING ]

/*
 * Notes
 *
 * determine if all required threads have been joined
 * if not, set the current thread to joined
 * if so, set the current thread to joined and create a new thread with the
 * join as its first step and then run the next step or end
 *
 */

// TODO: add thread end instead of workflow end
// because currently failing steps will go to the workflow end
// and cause any joins that steps path might terminate at to never complete
// instead fails should go to the last step in their thread

export default function joinThreads (payload, done) {
  let { workflowRun, thread } = payload

  done()
}

/*
need

steps that should be joined
current state of appropriate threads


 */