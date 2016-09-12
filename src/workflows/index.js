import _ from 'lodash'

import HelloWorld from './HelloWorld'
import Task from '../tasks/index'

let Workflow = []
let Step = []
let Parameter = []

let workflows = [
  HelloWorld
]

// merge all the workflows
_.forEach(workflows, (wf) => {
  if (_.isArray(wf.Workflow)) Workflow = _.union(Workflow, wf.Workflow)
  if (_.isArray(wf.Step)) Step = _.union(Step, wf.Step)
  if (_.isArray(wf.Parameter)) Parameter = _.union(Parameter, wf.Parameter)
})

export default { Workflow, Step, Parameter, Task }