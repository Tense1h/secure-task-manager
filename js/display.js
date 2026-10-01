export function createButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}
 
export function showMessage(messageElement, text) {
  messageElement.textContent = text;
}
 
export function renderCounts(elements, { total, pending, completed }) {
  elements.totalCount.textContent = total;
  elements.pendingCount.textContent = pending;
  elements.completedCount.textContent = completed;
}