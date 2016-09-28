import startWorkflow from './startWorkflow/index'
import runStep from './runStep/index'

export default function (backend) {
  return {
    startWorkflow: startWorkflow(backend),
    runStep: runStep(backend)
  }
}
