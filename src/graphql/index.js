import fields from './fields'
import schemas from './schemas'
import types from './types'
import externalTypes from './externalTypes'
import GraphQLFactory from 'graphql-factory'

export default function (backend) {
  let factory = GraphQLFactory(backend._graphql)
  let functions = backend.functions
  let plugin = backend.plugin

  return factory.make({
    globals: {},
    functions,
    fields,
    types,
    schemas,
    externalTypes
  }, { plugin })
}