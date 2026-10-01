import {
  EMPTY_MESSAGE,
  TASK_STATES,
  SAMPLE_TASKS,
  createTaskData,
  generateTaskId,
  summarizeStates
} from "./data.js";
import { isBlank, cleanText, getTaskIds } from "./utils.js";
import { createButton, showMessage, renderCounts } from "./display.js";
 
const elements = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  loadSamplesBtn: document.getElementById("loadSamplesBtn"),
  taskList: document.getElementById("taskList"),
  taskMessage: document.getElementById("taskMessage"),
  totalCount: document.getElementById("totalCount"),
  pendingCount: document.getElementById("pendingCount"),
  completedCount: document.getElementById("completedCount")
};
const { taskInput, addTaskBtn, loadSamplesBtn, taskList, taskMessage } = elements;
 
// Creates and returns one task <li>; it is NOT attached to #taskList here.
function createTaskElement(taskText, taskId) {
  const { id, text, state } = createTaskData(taskText, taskId);
 
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = id;
  taskItem.dataset.state = state;
 
  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = text;
 
  const buttons = [
    ["complete-btn", "Complete"],
    ["edit-btn", "Edit"],
    ["remove-btn", "Remove"]
  ].map(([className, label]) => createButton(className, label));
 
  taskItem.append(textSpan, ...buttons);
  return taskItem;
}
 
function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(taskMessage, EMPTY_MESSAGE);
    return;
  }
  const taskId = generateTaskId(getTaskIds(taskList));
  taskList.appendChild(createTaskElement(cleanText(taskText), taskId));
  taskInput.value = "";
  showMessage(taskMessage, "");
  updateTaskCounts();
}
 
function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? TASK_STATES.COMPLETED : TASK_STATES.PENDING;
  updateTaskCounts();
}
 
function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  if (!textSpan) return;
 
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;
 
  textSpan.replaceWith(editInput);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  editInput.focus();
}
 
function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;
 
  if (isBlank(editInput.value)) {
    showMessage(taskMessage, EMPTY_MESSAGE);
    return;
  }
 
  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = cleanText(editInput.value);
 
  editInput.replaceWith(textSpan);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  showMessage(taskMessage, "");
}
 
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}
 
// Counts are calculated from the current DOM, never hard-coded.
function updateTaskCounts() {
  const states = Array.from(taskList.querySelectorAll(".task-item"), (item) => item.dataset.state);
  renderCounts(elements, summarizeStates(states));
}
 
// Edit button acts as Edit or Save depending on whether an edit field is open.
function toggleTaskEdit(taskItem) {
  if (taskItem.querySelector(".edit-input")) {
    saveTaskEdit(taskItem);
  } else {
    beginTaskEdit(taskItem);
  }
}
 
// The single delegated click handler for Complete, Edit/Save, and Remove.
function handleTaskListClick(event) {
  const { target } = event;
  const taskItem = target.closest(".task-item");
  if (!taskItem) return;
 
  const actions = {
    ".complete-btn": toggleTaskComplete,
    ".edit-btn": toggleTaskEdit,
    ".remove-btn": removeTask
  };
  const match = Object.entries(actions).find(([selector]) => target.matches(selector));
  if (match) {
    const [, action] = match;
    action(taskItem);
  }
}
 
// Builds all sample tasks inside a fragment, then appends the fragment once.
function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS
    .map((text) => createTaskElement(text, generateTaskId(getTaskIds(taskList))))
    .forEach((taskItem) => fragment.appendChild(taskItem));
  taskList.appendChild(fragment);
  showMessage(taskMessage, "");
  updateTaskCounts();
}
 
// Events: exactly one click listener on #taskList.
taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addTask(taskInput.value);
});
 
updateTaskCounts();
 
// Exports for reuse and for test tools that call the functions directly.
export {
  createTaskElement,
  addTask,
  toggleTaskComplete,
  beginTaskEdit,
  saveTaskEdit,
  removeTask,
  updateTaskCounts,
  handleTaskListClick,
  loadSampleTasks
};
Object.assign(window, {
  createTaskElement, addTask, toggleTaskComplete, beginTaskEdit, saveTaskEdit,
  removeTask, updateTaskCounts, handleTaskListClick, loadSampleTasks
});