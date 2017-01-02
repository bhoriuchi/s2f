import { RunStatusEnum } from '../../graphql/types/index'

let { values: { CREATED } } = RunStatusEnum

export default {
  fields: {
    id: {
      type: 'String',
      primary: true
    },
    entityType: {
      type: 'EntityTypeEnum'
    },
    parentThread: {
      type: 'WorkflowRunThread',
      has: 'id'
    },
    workflowRun: {
      type: 'WorkflowRun',
      belongsTo: {
        WorkflowRun: { threads: 'id' }
      },
      has: 'id'
    },
    currentStepRun: {
      type: 'StepRun',
      has: 'id'
    },
    stepRuns: {
      type: ['StepRun']
    },
    status: {
      type: 'RunStatusEnum'
    }
  },
  _backend: {
    schema: 'S2FWorkflow',
    collection: 'workflow_run_thread',
    mutation: {
      create: {
        before (fnArgs, backend, done) {
          try {
            let { args } = fnArgs
            args.status = CREATED
            return done()
          } catch (err) {
            return done(err)
          }
        }
        /*
        args: {
          workflowRun: { type: 'String', nullable: false },
          currentStepRun: { type: 'String', nullable: false }
        }
        */
      } /* ,
      update: {
        args: {
          id: { type: 'String', nullable: false },
          currentStepRun: { type: 'String' },
          status: { type: 'RunStatusEnum' }
        }
      },
      delete: {
        args: {
          id: { type: 'String', nullable: false }
        }
      } */
    }
  }
}