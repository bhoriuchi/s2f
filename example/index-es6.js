import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_yj', graphql, rethinkdbdash())
let lib = backend.lib

// console.log(JSON.stringify(lib._definitions.definition.types.S2FWorkflowQuery.fields.readWorkflow, null, '  '))

/*
lib.S2FWorkflow(`{
  readWorkflow (id: "dd64cdb7-d089-48e0-8994-33dbc9ed6c4a") {
    id,
    endStep,
    steps {
      id,
      type,
      name,
      threads {
        id,
        type,
        name
      }
    }
  }
}`)
*/
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

// lib.S2FWorkflow(`{ readWorkflowRun { workflow { id, endStep }, id, threads { id, currentStepRun { id } } } }`)
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