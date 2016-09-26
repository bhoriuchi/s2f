import { rethinkdb as RethinkDBBackend } from '../src/backend/index'
import rethinkdbdash from 'rethinkdbdash'
import * as graphql from 'graphql'

let backend = RethinkDBBackend('_yj', graphql, rethinkdbdash())
let lib = backend.lib

// console.log(JSON.stringify(lib._definitions.definition.types.S2FWorkflowQuery.fields.readWorkflow, null, '  '))

// lib.S2FWorkflow(`{ readWorkflow (id: "f4a8f894-06ba-4213-80f1-80ff72e1039b") { id, endStep } }`)
lib.S2FWorkflow(`{ readWorkflowRun { workflow { id, endStep }, id, threads { id, currentStepRun { id } } } }`)
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