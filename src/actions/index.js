import startWorkflow from './startWorkflow'

export default function (backend) {
  return {
    startWorkflow: startWorkflow(backend)
  }
}
