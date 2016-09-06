import * as graphql from 'graphql'
import rethinkdbdash from 'rethinkdbdash'
import { rethinkdb as Backend } from '../src/backend'
import gql from '../src/graphql'
let r = rethinkdbdash()
let backend = new Backend(r, graphql)
let lib = gql(backend)

let op = 4


if (op === 1) {
  lib.Workflow('mutation Mutation { createTask (name: "Task1", source: "return 1") { id, name, source } }').then((task) => {
    if (task.errors) throw task.errors
    let taskId = task.data.createTask.id
    return lib.Workflow(`mutation Mutation { publishTask (id: "${taskId}") { _temporal { recordId } } }`)
  }).then((task) => {
    if (task.errors) throw task.errors
    let taskRecordId = task.data.publishTask._temporal.recordId
    return lib.Workflow('mutation Mutation { createWorkflow (name: "Workflow1") { id, name, steps { id, type } } }').then((wf) => {
      if (wf.errors) throw wf.errors
      let wfid = wf.data.createWorkflow.id
      return lib.Workflow(`mutation Mutation { createStep (workflowId: "${wfid}", name: "Step1", type: TASK, task: "${taskRecordId}") { id, name } }`).then((step) => {
        if (step.errors) throw step.errors
        let stepId = step.data.createStep.id
        return lib.Workflow(`mutation Mutation { createParameter (parentId: "${stepId}", name: "input1", scope: INPUT) { id } }`).then((param) => {
          return true
        })
      })
    })
  })
    .then((res) => {
      console.log('Query Result:')
      console.log(JSON.stringify(res, null, '  '))
      process.exit()
    })
    .catch((err) => {
      console.error(err)
      process.exit()
  })
} else if (op === 2) {
  lib.Workflow(`{ readWorkflow { id, name, parameters { id, name, type, scope }, steps { id, type, name, task { name, source }, parameters { id, name, type, scope } } } }`)
    .then((res) => {
      console.log('Query Result:')
      console.log(JSON.stringify(res, null, '  '))
      process.exit()
    }).catch((err) => {
    console.error(err)
    process.exit()
  })
} else if (op === 3) {
  lib.Workflow(`mutation Mutation { branchWorkflow (id: "b2bba671-9ced-4735-9836-c2b86236ff8c") { _temporal { recordId }, id, name, parameters { id, name, type, scope }, steps { id, type, name, task { name, source }, parameters { id, name, type, scope } } } }`)
    .then((res) => {
      console.log('Branch Result:')
      console.log(JSON.stringify(res, null, '  '))
      process.exit()
    })
    .catch((err) => {
      console.error(err)
      process.exit()
  })
} else if (op === 4) {
  lib.Workflow(`mutation Mutation { forkWorkflow (id: "b2bba671-9ced-4735-9836-c2b86236ff8c") { _temporal { recordId }, id, name, parameters { id, name, type, scope }, steps { id, type, name, task { name, source }, parameters { id, name, type, scope } } } }`)
    .then((res) => {
      console.log('Fork Result:')
      console.log(JSON.stringify(res, null, '  '))
      process.exit()
    })
    .catch((err) => {
      console.error(err)
      process.exit()
    })
}


// lib.Workflow(`mutation Mutation { deleteStep (id: "e6200c7c-ec11-44e8-9613-9052e1632125") }`)

// lib.Workflow(`mutation Mutation { deleteWorkflow (id: "ebe8c03f-e2b6-44b5-bba3-5689848e4be4") }`)
/*
lib.Workflow('mutation Mutation { createWorkflow (name: "TEST2") { id, name, steps { id, type } } }')
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
          return lib.Workflow(`mutation Mutation { updateParameter (id: "${pid}", name: "input2Updated") { id } }`).then((res) => {
            return res
          })
        })
      })
      .then(() => {
        return lib.Workflow(`mutation Mutation { createParameter (parentId: "${wfid}", name: "param2", scope: GLOBAL) { id, name} }`)
      })
      .then(() => {
        return lib.Workflow(`{ readWorkflow (id: "${wfid}") { id, name, parameters { id, name, type, scope }, steps { id, type, name, parameters { id, name, type, scope } } } }`)
      })
  })
*/

// lib.Workflow('mutation Mutation { createWorkflow (name: "TEST") { id, name, steps { id, type } } }')
// lib.Workflow(`{ readWorkflow (id: "3e7ed1be-9350-45d6-955a-7326ce69958a") { id, name, parameters { id, name, type, scope }, steps { id, type, name, task { name }, parameters { id, name, type, scope } } } }`)
