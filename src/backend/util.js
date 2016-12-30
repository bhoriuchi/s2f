import _ from 'lodash'
import { types, fields } from '../graphql/index'

const BACKEND_EXT = '_backend'

export function mergeConfig (config = {}) {

  let workflowTypes = _.cloneDeep(types)
  let schemaNames = _.union(_.get(config, 'options.schemas', []), ['S2FWorkflow'])
  let backendExtension = _.get(config, 'options.backendExtension', BACKEND_EXT)

  // move the backend extension if set
  _.forEach(workflowTypes, (definition) => {
    let _backend = _.get(definition, BACKEND_EXT)
    if (_.isObject(_backend) && backendExtension !== BACKEND_EXT) {
      definition[backendExtension] = _backend
      delete definition._backend
    }
  })

  // add custom schema names
  _.forEach(workflowTypes, (definition) => {
    if (_.has(definition, `["${backendExtension}"]`)) {
      definition[backendExtension].schema = schemaNames
    }
  })

  // merge passed config with required config
  return _.merge({}, config, { types: workflowTypes, fields })
}

export default {
  mergeConfig
}