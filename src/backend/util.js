import _ from 'lodash'
import { types, fields } from '../graphql/index'

export function mergeConfig (config = {}) {

  // merge passed config with required config
  return _.merge({}, config, { types, fields })
}

export function temporalTables () {
  return _.omitBy(_.mapValues(types, (type) => {
    let be = _.get(type, '_backend', {})
    return be.temporal ? { table: type.collection } : null
  }), (v) => {
    return v === null
  })
}

export default {
  mergeConfig
}