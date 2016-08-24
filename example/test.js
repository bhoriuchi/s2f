import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as Backend } from '../src/backend'
import gql from '../src/graphql'
let r = rethinkdbdash()
let backend = new Backend(r, graphql)
let lib = gql(backend)

// lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { name, steps { id, type } } }')
lib.Workflow('{ getWorkflow}')
  .then((res) => {
  console.log(JSON.stringify(res, null, '  '))
  process.exit()
}).catch((err) => {
  console.error(err)
  process.exit()
})