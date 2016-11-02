import _ from 'lodash'
import tasks from './tasks/index'
import workflows from './workflows/index'

let Workflow = []
let Step = []
let Parameter = []
let Task = []

let Folder = [
  {
    id: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
    entityType: 'FOLDER',
    name: 'Workflows',
    parent: 'ROOT',
    type: 'WORKFLOW'
  },
  {
    id: '4acb1f18-2935-4708-8d3c-69c7209f8d87',
    entityType: 'FOLDER',
    name: 'Tasks',
    parent: 'ROOT',
    type: 'TASK'
  },
  {
    id: '9595014b-5614-4475-8e0e-4d07e4e865b6',
    entityType: 'FOLDER',
    name: 'Examples',
    parent: 'c841607d-9d26-43fc-9e7e-8eab7c9fd892',
    type: 'WORKFLOW'
  },
  {
    id: '067c20db-c009-4277-aeda-e3db9af31472',
    entityType: 'FOLDER',
    name: 'Examples',
    parent: '4acb1f18-2935-4708-8d3c-69c7209f8d87',
    type: 'TASK'
  }
]

let FolderMembership = [
  {
    folder: '067c20db-c009-4277-aeda-e3db9af31472',
    childType: 'TASK',
    childId: '4c35b5a7-e971-4719-9846-ca06db2f8eb2'
  },
  {
    folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
    childType: 'WORKFLOW',
    childId: '72264666-5e7b-4bd7-b6f6-efff3a5aa73c'
  },
  {
    folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
    childType: 'WORKFLOW',
    childId: '151743c4-93ee-48ab-a7d3-608a5d06900e'
  },
  {
    folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
    childType: 'WORKFLOW',
    childId: 'c5801b61-a7cd-4995-964b-c0a1f368de7c'
  },
  {
    folder: '9595014b-5614-4475-8e0e-4d07e4e865b6',
    childType: 'WORKFLOW',
    childId: '2464780a-92ba-475b-b7a6-c49a0a9d189b'
  }
]

// merge all the workflows
_.forEach(_.union(workflows, tasks), (def) => {
  if (_.isArray(def.Workflow)) Workflow = _.union(Workflow, def.Workflow)
  if (_.isArray(def.Step)) Step = _.union(Step, def.Step)
  if (_.isArray(def.Parameter)) Parameter = _.union(Parameter, def.Parameter)
  if (_.isArray(def.Task)) Task = _.union(Task, def.Task)
})

export default { Workflow, Step, Parameter, Task, Folder, FolderMembership }