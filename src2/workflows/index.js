import _ from 'lodash'

import HelloWorld from './HelloWorld'
import tasks from '../tasks/index'

let Workflow = []
let Step = []
let Parameter = []
let Task = []

let workflows = [
  HelloWorld
]

// merge all the workflows
_.forEach(_.union(workflows, tasks), (def) => {
  if (_.isArray(def.Workflow)) Workflow = _.union(Workflow, def.Workflow)
  if (_.isArray(def.Step)) Step = _.union(Step, def.Step)
  if (_.isArray(def.Parameter)) Parameter = _.union(Parameter, def.Parameter)
  if (_.isArray(def.Task)) Task = _.union(Task, def.Task)
})

export default { Workflow, Step, Parameter, Task }