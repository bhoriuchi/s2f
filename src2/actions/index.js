import startWorkflow from './startWorkflow'
import runStep from './runStep'

export default function (backend) {
  return {
    startWorkflow: startWorkflow(backend),
    runStep: runStep(backend)
  }
}
