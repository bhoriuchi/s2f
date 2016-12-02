import _ from 'lodash'
import backend from './backend'
let lib = backend.lib

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
  .then((res) => {
  let steps = _.get(res, 'data.readWorkflow[0].steps')
    console.log(JSON.stringify(steps, null, '  '))
    setTimeout(process.exit, 10)
  })
  .catch((err) => {
    console.error(err)
    setTimeout(process.exit, 10)
  })