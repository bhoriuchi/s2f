export default function nextStepRun (payload) {
  let { workflowRun, step } = payload

  return this.lib.S2FWorkflow(`{
      readWorkflowRun (id: "${workflowRun}") {
        workflow {
          endStep,
          steps (id: "${step}") {
            id,
            type,
            async,
            source,
            subWorkflow,
            timeout,
            failsWorkflow,
            waitOnSuccess,
            requireResumeKey,
            success,
            fail,
            parameters { id, name, type, scope, class, mapsTo }
          }
        },
        args,
        input,
        context {
          parameter { id, name, type, scope, class },
          value
        }
      }
    }`)

}