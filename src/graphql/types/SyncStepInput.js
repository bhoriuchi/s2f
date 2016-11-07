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
    failsWorkflow: 'Boolean',
    waitOnSuccess: 'Boolean',
    requireResumeKey: 'Boolean',
    parameters: ['SyncParameterInput'],
    task: 'SyncIdInput',
    subWorkflow: 'SyncIdInput',
    success: 'String',
    fail: 'String',
    ex: 'FactoryJSON',
    threads: ['SyncIdInput']
  }
}