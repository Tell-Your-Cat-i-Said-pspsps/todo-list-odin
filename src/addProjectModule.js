export function addProjectModal() {
  const addProjectModal = document.createElement("dialog");
  addProjectModal.classList.add("addProjectModal");
  const projectNameInputLabel = document.createElement("label");
  projectNameInputLabel.setAttribute("for", "projectNameInput");
  const projectNameInput = document.createElement("input");
  projectNameInput.setAttribute("type", "text");
  projectNameInput.setAttribute("id", "projectNameInput");
}
