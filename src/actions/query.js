import _ from 'lodash'
import obj2arg from 'graphql-obj2arg'
import { expandGQLErrors } from './common'
import chalk from 'chalk'

export function getStepRun (backend, stepRunId, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`{
    readStepRun (id: "${stepRunId}") {
      status,
      thread {
        id,
        workflowRun {
          id,
          args,
          input,
          context {
            id,
            parameter { id, name, type, scope, class },
            value
          },
          workflow {
            endStep { id }
          }
        }
      },
      step {
        id,
        type,
        async,
        source,
        subWorkflow {
          _temporal { recordId },
          id
        },
        timeout,
        failsWorkflow,
        waitOnSuccess,
        requireResumeKey,
        success,
        fail,
        parameters { id, name, type, scope, class, mapsTo }
      }
    }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.readStepRun[0]'))
    })
    .catch(callback)
}

export function endWorkflowRun (backend, workflowRun, status, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    endWorkflowRun (id: "${workflowRun}", status: ${status})
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.endWorkflowRun'))
    })
    .catch(callback)
}

export function getRunSummary (backend, workflowRun, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`{
    readWorkflowRun (id: "${workflowRun}") {
      context {
        parameter { name },
        value
      },
      threads {
        stepRuns {
          step { type, failsWorkflow }
          status
        }
      },
      parentStepRun,
      taskId
    }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.readWorkflowRun[0]'))
    })
    .catch(callback)
}

export function getRunThreads (backend, workflowRun, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`{
    readWorkflowRun (id: "${workflowRun}") {
      threads { id, status }
    }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.readWorkflowRun[0].threads'))
    })
    .catch(callback)
}

export function newStepRun (backend, stepId, thread, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    createStepRun (step: "${stepId}", workflowRunThread: "${thread}"),
    { id }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.createStepRun'))
    })
    .catch(callback)
}

export function getStep (backend, stepId, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`{
    readStep (id: "${stepId}") {
      id, name, type
    }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.readStep[0]'))
    })
    .catch(callback)
}

export function newForks (backend, stepId, workflowRun, thread, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    createForks (step: "${stepId}", workflowRun: "${workflowRun}", workflowRunThread: "${thread}")
    { id }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.createForks'))
    })
    .catch(callback)
}

export function setStepRunStatus (backend, stepRunId, status, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    setStepRunStatus (id: "${stepRunId}", status: ${status})
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.setStepRunStatus'))
    })
    .catch(callback)
}

export function updateAttributeValues (backend, outputs, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    updateAttributeValues (values: ${obj2arg(outputs)})
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.updateAttributeValues'))
    })
    .catch(callback)
}

export function updateWorkflowRunThread (backend, args, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    updateWorkflowRunThread (${obj2arg(args, { noOuterBraces: true })})
    { id }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.updateWorkflowRunThread'))
    })
    .catch(callback)
}

export function startStepRun (backend, stepRunId, taskId, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    startStepRun (
      id: "${stepRunId}",
      taskId: "${taskId}"
    )
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.startStepRun'))
    })
    .catch(callback)
}

export function newWorkflowRun (backend, args, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`mutation Mutation {
    createWorkflowRun (${obj2arg(args, { noOuterBraces: true })}) {
      id,
      threads { id }
    }
  }`, {}, args)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.createWorkflowRun'))
    })
    .catch(callback)
}

export function getWorkflowRun (backend, workflowRun, thread, callback) {
  let GraphQLError = backend.graphql.GraphQLError

  return backend.lib.S2FWorkflow(`{
    readWorkflowRun (id: "${workflowRun}") {
      workflow { endStep { id } },
      requestId,
      args,
      input,
      context {
        id,
        parameter { id, name, type, scope, class },
        value
      },
      threads (id: "${thread}") {
        currentStepRun {
          id,
          step {
            id,
            type,
            async,
            source,
            subWorkflow {
              _temporal { recordId },
              id
            },
            timeout,
            failsWorkflow,
            waitOnSuccess,
            requireResumeKey,
            success,
            fail,
            parameters { id, name, type, scope, class, mapsTo }
          }
        }
      }
    }
  }`)
    .then((result) => {
      if (result.errors) return callback(new GraphQLError(expandGQLErrors(result.errors)))
      return callback(null, _.get(result, 'data.readWorkflowRun[0]'))
    })
    .catch(callback)
}


export default {
  getStepRun,
  endWorkflowRun,
  getRunSummary,
  getRunThreads,
  newStepRun,
  getStep,
  newForks,
  setStepRunStatus,
  updateAttributeValues,
  startStepRun,
  newWorkflowRun,
  getWorkflowRun,
  updateWorkflowRunThread
}