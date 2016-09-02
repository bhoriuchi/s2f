export default {
  extendFields: ['Entity'],
  fields: {
    queuedAt: {
      description: 'When the run was queued',
      type: 'FactoryDateTime'
    },
    stepRun: {
      description: 'Step run associated with the run',
      type: 'String'
    },
    runner: {
      description: 'Runner the run is assigned to',
      type: 'String'
    },
    state: {
      description: 'State of the run',
      type: 'RunQueueStateEnum'
    }
  }
}