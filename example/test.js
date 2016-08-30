import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as Backend } from '../src/backend'
import gql from '../src/graphql'
let r = rethinkdbdash()
let backend = new Backend(r, graphql)
let lib = gql(backend)

lib.Workflow(`mutation Mutation { deleteWorkflow (id: "5eb79314-dbb0-4b0d-8d6a-dff9070df876") }`)
/*
lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { id, name, steps { id, type } } }')
  .then((wf) => {
    if (wf.errors) throw wf.errors
    let wfid = wf.data.createWorkflow.id
    return lib.Workflow(`mutation Mutation { createStep (workflowId: "${wfid}", name: "Step2", type: BASIC) { id, name } }`)
      .then((step) => {
        if (step.errors) throw step.errors
        let sid = step.data.createStep.id
        return lib.Workflow(`mutation Mutation { createParameter (parentId: "${sid}", name: "input1", scope: INPUT) { id } }`).then((param) => {
          if (param.errors) throw param.errors
          let pid = param.data.createParameter.id
          return lib.Workflow(`mutation Mutation { updateParameter (id: "${pid}", name: "input1Updated") { id } }`).then((res) => {
            return res
          })
        })
      })
      .then(() => {
        return lib.Workflow(`mutation Mutation { createParameter (parentId: "${wfid}", name: "param1", scope: GLOBAL) { id, name} }`)
      })
      .then(() => {
        return lib.Workflow(`{ readWorkflow (id: "${wfid}") { id, name, parameters { id, name, type, scope }, steps { id, type, name, parameters { id, name, type, scope } } } }`)
      })
  })

*/
// lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { id, name, steps { id, type } } }')
// lib.Workflow(`{ readWorkflow (id: "a570d604-4926-4307-a3c6-504ecb9473d2") { id, name, parameters { id, name, type, scope }, steps { id, type, name, parameters { id, name, type, scope } } } }`)
  .then((res) => {
    console.log('Query Result:')
    console.log(JSON.stringify(res, null, '  '))
    process.exit()
  })
  .catch((err) => {
    console.error(err)
    process.exit()
  })