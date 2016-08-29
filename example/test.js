import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as Backend } from '../src/backend'
import gql from '../src/graphql'
let r = rethinkdbdash()
let backend = new Backend(r, graphql)
let lib = gql(backend)

/*
lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { id, name, steps { id, type } } }')
  .then((wf) => {
    let wfid = wf.data.createWorkflow.id
    return lib.Workflow(`mutation Mutation { createStep (workflowId: "${wfid}", name: "Step2", type: BASIC) { id, name } }`)
      .then((step) => {
        let sid = step.data.createStep.id
        return lib.Workflow(`mutation Mutation { createInputParameter (stepId: "${sid}", name: "input1") { id } }`).then((res) => {
          console.log(res)
          return res
        })
      })
      .then(() => {
        return lib.Workflow(`mutation Mutation { createGlobalParameter (workflowId: "${wfid}", name: "param1") { id, name} }`)
      })
      .then(() => {
        return lib.Workflow(`{ readWorkflow (id: "${wfid}") { id, name, parameters { id, name, type, scope }, steps { id, type, name, parameters { id, name, type, scope } } } }`)
      })
  })
*/
lib.Workflow(`{ readWorkflow (id: "a570d604-4926-4307-a3c6-504ecb9473d2") { id, name, parameters { id, name, type, scope }, steps { id, type, name, parameters { id, name, type, scope } } } }`)
  .then((res) => {
    console.log('Query Result:')
    console.log(JSON.stringify(res, null, '  '))
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit()
  })