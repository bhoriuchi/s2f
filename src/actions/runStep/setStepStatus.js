import { gqlResult } from '../common'

export default function setStepStatus (stepRunId, status) {
  return this.lib.S2FWorkflow(`mutation Mutation { endStepRun (id: "${stepRunId}", status: ${status}) }`)
    .then((result) => gqlResult(this, result, (err, data) => {
      if (err) throw err
      return data
    }))
}