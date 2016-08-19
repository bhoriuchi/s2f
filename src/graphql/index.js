import fields from './fields'
import schemas from './schemas'
import types from './types'
import externalTypes from './externalTypes'

import * as graphql from './graphql'
import GraphQLFactory from 'graphql-factory'
let factory = GraphQLFactory(graphql)

export default function (functions) {
  return factory.make({
    functions,
    fields,
    types,
    schemas,
    externalTypes,
    globals: {}
  })
}