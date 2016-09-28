import Promise from 'bluebird'

export default function forkSteps (payload, done) {
  let { workflowRun, thread, step: { threads } } = payload

  console.log(threads)
  done()
}