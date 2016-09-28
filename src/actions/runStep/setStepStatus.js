export default function setStepStatus (stepRunId, status) {
  return this.lib.S2FWorkflow(`mutation Mutation { endStepRun (id: "${stepRunId}", status: "${status}") }`)
}