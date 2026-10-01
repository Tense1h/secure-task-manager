export const EMPTY_MESSAGE = "Task cannot be empty";
 
export const TASK_STATES = {
  PENDING: "pending",
  COMPLETED: "completed"
};
 
export const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];
 
let taskCounter = 0;
 
// Builds a plain task object.
export function createTaskData(text, id) {
  return { id, text, state: TASK_STATES.PENDING };
}
 
// Returns a "task-N" ID that is not in the list of existing IDs.
export function generateTaskId(existingIds = []) {
  let id;
  do {
    taskCounter += 1;
    id = `task-${taskCounter}`;
  } while (existingIds.includes(id));
  return id;
}
 
// Takes an array of state strings and returns the three summary counts.
export function summarizeStates(states) {
  const total = states.length;
  const completed = states.filter((state) => state === TASK_STATES.COMPLETED).length;
  return { total, completed, pending: total - completed };
}