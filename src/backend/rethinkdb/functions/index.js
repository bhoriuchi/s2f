import { createParameter, updateParameter, deleteParameter } from './parameter'
import { createParameterRun, updateParameterRun, deleteParameterRun, updateAttributeValues } from './parameterRun'
import { createStep, readStep, updateStep, deleteStep, readStepThreads } from './step'
import { createStepRun, startStepRun, endStepRun, createForks } from './stepRun'
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
    updateAttributeValues,
    createStep,
    readStep,
    updateStep,
    deleteStep,
    readStepThreads,
    createStepRun,
    startStepRun,
    endStepRun,
    createForks,
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