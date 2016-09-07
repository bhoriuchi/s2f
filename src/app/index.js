import actions from '../actions/index'
import gql from '../graphql/index'

export function app (backend) {
  let lib = gql(backend)
  backend.Workflow = lib.Workflow
  backend.actions = actions(backend)

  return backend
}

export default app