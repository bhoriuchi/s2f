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
  readWorkflow,
  updateWorkflow,
  deleteWorkflow,
  readWorkflowInputs,
  readWorkflowVersions,
  readWorkflowParameters
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
  readWorkflow,
  updateWorkflow,
  deleteWorkflow,
  readWorkflowInputs,
  readWorkflowVersions,
  readWorkflowParameters,
  createWorkflowRun,
  updateWorkflowRun,
  deleteWorkflowRun,
  endWorkflowRun
}