import { createParameter, updateParameter, deleteParameter } from './parameter'
import { createParameterRun, updateParameterRun, deleteParameterRun, updateAttributeValues } from './parameterRun'
import { createStep, readStep, updateStep, deleteStep, readStepThreads, readSource, readStepParams } from './step'
import { createStepRun, startStepRun, endStepRun, createForks, getJoinThreads } from './stepRun'
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
import { createWorkflowRun, updateWorkflowRun, deleteWorkflowRun, endWorkflowRun } from './workflowRun'

export default {
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
  readSource,
  readStepParams,
  createStepRun,
  startStepRun,
  endStepRun,
  createForks,
  getJoinThreads,
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
  deleteWorkflowRun,
  endWorkflowRun
}