import _ from 'lodash'
import StateEnum from '../graphql/types/ClusterNodeStateEnum'
import RoleEnum from '../graphql/types/ClusterNodeRoleEnum'

// export enums
export const SCHEDULER =  RoleEnum.values.SCHEDULER
export const TIEBREAKER = RoleEnum.values.TIEBREAKER
export const RUNNER = RoleEnum.values.RUNNER
export const OFFLINE = StateEnum.values.OFFLINE
export const ONLINE = StateEnum.values.ONLINE

export const LOG_LEVELS = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
  silent: 100
}

export function logLevel (level = 'info') {
  level = _.toLower(level)
  return _.get(LOG_LEVELS, level, LOG_LEVELS.info)
}

export function isScheduler () {
  return _.includes(this.roles, SCHEDULER)
}
export function isTiebreaker () {
  return _.includes(this.roles, TIEBREAKER)
}
export function isRunner () {
  return _.includes(this.roles, RUNNER)
}

export default {
  isScheduler,
  isTiebreaker,
  isRunner,
  logLevel
}