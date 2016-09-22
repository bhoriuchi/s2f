import { createParameter, updateParameter, deleteParameter } from './parameter'
import { createStep, readStep, updateStep, deleteStep } from './step'
import { createStepRun, startStepRun, endStepRun } from './stepRun'
import { createTask, readTask, updateTask, deleteTask } from './task'
import {
  branchWorkflow,
  forkWorkflow,
  publishWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  readWorkflowInputs
} from './workflow'
import { createWorkflowRun } from 'workflowRun'

export default function (backend) {
  return {
    createParameter: createParameter(backend),
    updateParameter: updateParameter(backend),
    deleteParameter: deleteParameter(backend),
    createStep: createStep(backend),
    readStep: readStep(backend),
    updateStep: updateStep(backend),
    deleteStep: deleteStep(backend),
    createStepRun: createStepRun(backend),
    startStepRun: startStepRun(backend),
    endStepRun: endStepRun(backend),
    createTask: createTask(backend),
    readTask: readTask(backend),
    updateTask: updateTask(backend),
    deleteTask: deleteTask.(backend),
    branchWorkflow: branchWorkflow(backend),
    forkWorkflow: forkWorkflow(backend),
    publishWorkflow: publishWorkflow(backend),
    createWorkflow: createWorkflow(backend),
    updateWorkflow: updateWorkflow(backend),
    deleteWorkflow: deleteWorkflow(backend),
    readWorkflowInputs: readWorkflowInputs(backend),
    createWorkflowRun: createWorkflowRun(backend)
  }
}