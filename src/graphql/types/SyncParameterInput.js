export default {
  type: 'Input',
  fields: {
    id: { type: 'String', nullable: false },
    name: { type: 'String', nullable: false },
    description: { type: 'String' },
    type: { type: 'ParameterTypeEnum', nullable: false },
    scope: { type: 'ParameterScopeEnum', nullable: false },
    class: { type: 'ParameterClassEnum', nullable: false },
    required: { type: 'Boolean'},
    mapsTo: { type: 'String' },
    defaultValue: { type: 'String' }
  }
}