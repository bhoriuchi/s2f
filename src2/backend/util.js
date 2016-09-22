import _ from 'lodash'
import FactoryTemporalPlugin from 'graphql-factory-temporal'
import { types, fields } from '../graphql/index'

export function mergeConfig (config = {}) {
  // merge plugins
  let plugin = _.union([ FactoryTemporalPlugin ], _.isArray(config.plugin) ? config.plugin : [])

  // merge passed config with required config
  return _.merge({}, config, { types, fields, plugin })
}

export default {
  mergeConfig
}