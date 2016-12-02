export default {
  type: 'Input',
  fields: {
    id: { type: 'String', nullable: false },
    name: { type: 'String', nullable: false },
    description: { type: 'String' },
    type: { type: 'StepTypeEnum', nullable: false },
    async: 'Boolean',
    source: 'String',
    versionArgs: 'FactoryJSON',
    timeout: 'Int',
    failsWorkflow: 'Boolean',
    waitOnSuccess: 'Boolean',
    requireResumeKey: 'Boolean',
    parameters: ['SyncParameterInput'],
    task: 'SyncTemporalInput',
    subWorkflow: 'SyncTemporalInput',
    success: 'String',
    fail: 'String',
    ex: 'FactoryJSON',
    threads: ['SyncIdInput']
  }
}