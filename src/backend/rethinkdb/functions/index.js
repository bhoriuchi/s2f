import { createParameter, updateParameter, deleteParameter } from './parameter'
import { createParameterRun, updateParameterRun, deleteParameterRun } from './parameterRun'
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
import { createWorkflowRun, updateWorkflowRun, deleteWorkflowRun } from './workflowRun'

export default function (backend) {
  return {
    createParameter,
    updateParameter,
    deleteParameter,
    createParameterRun,
    updateParameterRun,
    deleteParameterRun,
    createStep,
    readStep,
    updateStep,
    deleteStep,
    createStepRun,
    startStepRun,
    endStepRun,
    createTask,
    readTask,
    updateTask,
    deleteTask,
    branchWorkflow,
    forkWorkflow,
    publishWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    readWorkflowInputs,
    createWorkflowRun,
    updateWorkflowRun,
    deleteWorkflowRun
  }
}