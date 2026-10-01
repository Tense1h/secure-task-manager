export function cleanText(value) {
  return String(value).trim();
}
 
export function isBlank(value) {
  return cleanText(value) === "";
}
 
// Collects every data-task-id currently inside the list.
export function getTaskIds(taskList) {
  return Array.from(taskList.querySelectorAll(".task-item"), (item) => item.dataset.taskId);
}