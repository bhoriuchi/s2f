import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_yj', graphql, rethinkdbdash())
let lib = backend.lib

// console.log(JSON.stringify(lib._definitions.definition.types.S2FWorkflowQuery.fields.readWorkflow, null, '  '))
/*
lib.S2FWorkflow(`{
  readWorkflow {
    _temporal {
      recordId,
      version
    },
    id,
    name
  }
}`)
*/
/*
lib.S2FWorkflow(`{
  readWorkflow (id: "f4a8f894-06ba-4213-80f1-80ff72e1039b") {
    id,
    name,
    parameters { id, name, type, class, required, defaultValue }
  }
}`)
*/
/*
lib.S2FWorkflow(`{
  readWorkflow {
    id,
    inputs { id, name, type, class, required, defaultValue },
    endStep,
    steps {
      id,
      type,
      name,
      source,
      parameters { id, name, type, class, required, defaultValue },
      threads {
        id,
        type,
        name,
        success,
        fail
      }
    }
  }
}`)
*/
/*
lib.S2FWorkflow(`mutation Mutation {
  createForks (
    step: "4cc47451-7115-49b5-ace2-4d05fc3ad09c",
    workflowRun: "asdfjkl",
    thread: "asdf"
  )
  {
    id
  }
}`)
*/
// lib.S2FWorkflow(`{ readWorkflowRun { workflow { id, endStep }, id, threads { id, currentStepRun { id } } } }`)
/*
lib.S2FWorkflow(`{
  readRootFolder (type: WORKFLOW) {
    id,
    name,
    type,
    subFolders { id, name, type },
    entities { id, name, description }
  }
}`)
*/
lib.S2FWorkflow(`{
  readSubFolder (id: "9595014b-5614-4475-8e0e-4d07e4e865b6") {
    id,
    name,
    type,
    subFolders { id, name, type },
    entities { id, name }
  }
}`)
  .then((res) => {
    console.log(JSON.stringify(res, null, '  '))
    process.exit()
  })
  .catch((err) => {
    console.log(err)
    process.exit()
  })

// console.log(backend)
// console.log(backend.lib._definitions.functions.createParameterRun.toString())
//console.log(backend.plugin.types.S2FWorkflowMutation.fields.createParameterRun)
// process.exit()