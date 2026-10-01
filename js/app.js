const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
 
const EMPTY_MESSAGE = "Task cannot be empty";
let taskCounter = 0;
 
function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
}
 
function showMessage(text) {
  taskMessage.textContent = text;
}
 
function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}
 
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";
 
  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;
 
  taskItem.append(
    textSpan,
    createButton("complete-btn", "Complete"),
    createButton("edit-btn", "Edit"),
    createButton("remove-btn", "Remove")
  );
  return taskItem;
}
 
function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }
  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);
  taskInput.value = "";
  showMessage("");
  updateTaskCounts();
}
 
function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
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
 
  const newText = editInput.value.trim();
  if (newText === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }
 
  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = newText;
 
  editInput.replaceWith(textSpan);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  showMessage("");
}
 
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}
 
function updateTaskCounts() {
  const total = taskList.querySelectorAll(".task-item").length;
  const completed = taskList.querySelectorAll('.task-item[data-state="completed"]').length;
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = total - completed;
}
 
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem) return;
 
  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}
 
function loadSampleTasks() {
  const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];
  const fragment = document.createDocumentFragment();
  sampleTasks.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  showMessage("");
  updateTaskCounts();
}
 
taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", function () { addTask(taskInput.value); });
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask(taskInput.value);
});
 
updateTaskCounts();