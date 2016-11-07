import _ from 'lodash'
import backend from './backend'
let lib = backend.lib
let toObjectString = backend.factory.utils.toObjectString
let Enum = backend.factory.utils.Enum

let sync = {
  "_temporal": {
    "name": "b4",
    "validFrom": null,
    "validTo": null,
    "version": null
  },
  "id": "e2ce343b-61a8-4b45-bef3-3219db141657",
  "name": "Hello World",
  "description": null,
  "parameters": [
    {
      "id": "4f681b3c-4be1-47af-baf0-20329947d8a3",
      "name": "message",
      "description": null,
      "type": "STRING",
      "scope": "WORKFLOW",
      "class": "ATTRIBUTE",
      "required": true,
      "mapsTo": null,
      "defaultValue": "Hello"
    }
  ],
  "steps": [
    {
      "id": "e270d54e-ad05-4137-98a7-c1273f1038e9",
      "name": "End",
      "description": "Ending point of the workflow",
      "type": "END",
      "async": null,
      "source": null,
      "versionArgs": null,
      "failsWorkflow": false,
      "waitOnSuccess": false,
      "requireResumeKey": false,
      "task": null,
      "subWorkflow": null,
      "parameters": [],
      "success": "e270d54e-ad05-4137-98a7-c1273f1038e9",
      "fail": "e270d54e-ad05-4137-98a7-c1273f1038e9",
      "ex": {
        "ui": {
          "x": 566,
          "y": 102
        }
      },
      "threads": [],
      "cell": "0ba244a1-2c9b-41bc-b947-3f33146d0c3f"
    },
    {
      "id": "ec7e87be-fbc9-41f5-8739-803333ba7e13",
      "name": "Say Hello",
      "description": null,
      "type": "TASK",
      "async": false,
      "source": null,
      "versionArgs": {},
      "failsWorkflow": false,
      "waitOnSuccess": false,
      "requireResumeKey": false,
      "task": null,
      "subWorkflow": null,
      "parameters": [],
      "success": "new:df78227ce20899f15795073c8dda7920",
      "fail": null,
      "ex": {
        "ui": {
          "x": 180,
          "y": 100
        }
      },
      "threads": [],
      "cell": "6ea0c747-cf6b-485d-bcb6-a5c02a378024"
    },
    {
      "id": "ae8217d4-6847-4afa-b973-2280b6ef814b",
      "name": "Start",
      "description": "Starting point of the workflow",
      "type": "START",
      "async": null,
      "source": null,
      "versionArgs": null,
      "failsWorkflow": false,
      "waitOnSuccess": false,
      "requireResumeKey": false,
      "task": null,
      "subWorkflow": null,
      "parameters": [],
      "success": "ec7e87be-fbc9-41f5-8739-803333ba7e13",
      "fail": "e270d54e-ad05-4137-98a7-c1273f1038e9",
      "ex": {
        "ui": {
          "x": 30,
          "y": 100
        }
      },
      "threads": [],
      "cell": "f389075b-ad06-4172-8aa2-cb1c92415ba6"
    },
    {
      "id": "new:df78227ce20899f15795073c8dda7920",
      "name": "Fork Test",
      "type": "WORKFLOW",
      "source": "",
      "async": false,
      "versionArgs": null,
      "failsWorkflow": false,
      "waitOnSuccess": false,
      "requireResumeKey": false,
      "parameters": [
        {
          "id": "new:8b2ec12d35f69584d71df376b6b45d44",
          "name": "name",
          "description": null,
          "type": "STRING",
          "scope": "STEP",
          "class": "INPUT",
          "required": true
        }
      ],
      "threads": [],
      "success": "e270d54e-ad05-4137-98a7-c1273f1038e9",
      "fail": null,
      "ex": {
        "ui": {
          "x": 311,
          "y": 102
        }
      },
      "cell": "d55e9950-8375-4e24-8c64-74f053aece86",
      "subWorkflow": {
        "id": "dd64cdb7-d089-48e0-8994-33dbc9ed6c4a"
      },
      "description": null
    }
  ]
}

_.forEach(sync.parameters, (p) => {
  p.type = Enum(p.type)
  p.scope = Enum(p.scope)
  p.class = Enum(p.class)
})

_.forEach(sync.steps, (s) => {
  s.type = Enum(s.type)
  delete s.cell
  _.forEach(s.parameters, (p) => {
    p.type = Enum(p.type)
    p.scope = Enum(p.scope)
    p.class = Enum(p.class)
  })
})
delete sync._temporal

// console.log(toObjectString(sync))
lib.S2FWorkflow(`mutation Mutation {
  syncWorkflow (${toObjectString(sync, { noOuterBraces: true })})
  {
    id
  }
}`)
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
let id = ''

id = 'e38faf1f-1ae4-4450-91b8-afb7c2e472c8'
// id = 'f4a8f894-06ba-4213-80f1-80ff72e1039b'

lib.S2FWorkflow(`{ readWorkflow (id: "${id}") {
    id,
    name,
    inputs { id, name, type, class, required, defaultValue },
    parameters { id, name, type, class, required, defaultValue },
    steps {
      id,
      name,
      source,
      task {
        id
      },
      subWorkflow {
        id,
        name,
        inputs { id, name, type, class, required, defaultValue }
      }
    }
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
/*
lib.S2FWorkflow(`{
  readSubFolder (id: "9595014b-5614-4475-8e0e-4d07e4e865b6") {
    id,
    name,
    type,
    subFolders { id, name, type },
    entities { id, name }
  }
}`)
*/
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