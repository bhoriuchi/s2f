import fields from './fields'
import schemas from './schemas'
import types from './types'
import GraphQLFactory from 'graphql-factory'
import FactoryTypePlugin from 'graphql-factory-types'

export default function (backend) {
  let factory = GraphQLFactory(backend._graphql)
  let functions = backend.functions
  let BackendPlugin = backend.plugin

  return factory.make({
    globals: {},
    functions,
    fields,
    types,
    schemas
  }, {
    plugin: [
      BackendPlugin,
      FactoryTypePlugin
    ]
  })
}