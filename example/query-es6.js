import _ from 'lodash'
import backend from './backend'
let lib = backend.lib

// console.log(backend.lib._definitions.schemas.S2FWorkflow._mutationType._fields.branchTask)
// console.log(backend.plugin.functions.branchTemporalTask.toString())
// process.exit()

/*
lib.S2FWorkflow(`{
  readWorkflow (
    id: "f4a8f894-06ba-4213-80f1-80ff72e1039b"
  )
  {
    _temporal {
      name,
      validFrom,
      validTo,
      version
    },
    id,
    name,
    description,
    parameters {
      id,
      name,
      description,
      type,
      scope,
      class,
      required,
      mapsTo,
      defaultValue
    },
    steps {
      id,
      name,
      description,
      type,
      async,
      source,
      versionArgs,
      failsWorkflow,
      waitOnSuccess,
      requireResumeKey,
      task { id },
      subWorkflow { id },
      parameters {
        id,
        name,
        description,
        type,
        scope,
        class,
        required,
        mapsTo,
        defaultValue
      },
      success,
      fail,
      ex,
      threads {
        id
      }
    }
  }
}`)
  */
lib.S2FWorkflow(`mutation Mutation {
  branchTask (
    id: "b98548c6-d294-4406-88c1-3d7cffb97cfa",
    name: "stuff",
    changeLog: {
      user: "test",
      message: "testing"
    }
  ) { _temporal {version, recordId }, id }
}`)
  .then((res) => {
    console.log(res)
    // let steps = _.get(res, 'data.readWorkflow[0].steps')
    // console.log(JSON.stringify(steps, null, '  '))
    setTimeout(process.exit, 100)
  })
  .catch((err) => {
    console.error(err)
    setTimeout(process.exit, 100)
  })