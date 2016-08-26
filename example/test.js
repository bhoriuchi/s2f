import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as Backend } from '../src/backend'
import gql from '../src/graphql'
let r = rethinkdbdash()
let backend = new Backend(r, graphql)
let lib = gql(backend)

// lib.Workflow('mutation Mutation { createStep (workflowId: "d1a7bdc4-032f-46c4-a757-18ebc46a7d78", name: "Step1", type: Basic) { id, name } }')
// lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { name, steps { id, type } } }')
lib.Workflow('{ readWorkflow (id: "d1a7bdc4-032f-46c4-a757-18ebc46a7d78") { id, name, steps { id, type, name } } }')
  .then((res) => {
  console.log(JSON.stringify(res, null, '  '))
  process.exit()
}).catch((err) => {
  console.error(err)
  process.exit()
})