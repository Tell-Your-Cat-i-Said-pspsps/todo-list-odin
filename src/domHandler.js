import closeImg from "./close.svg";
export function domProjectTabLoader(
  project,
  domProjectsTabContainer,
  removeProject,
  updateStorageFn,
) {
  const projectName = project.projectName;
  const projectTab = document.createElement("dd");
  projectTab.classList.add("project");
  const projectTabInput = document.createElement("input");
  projectTabInput.setAttribute("type", "radio");
  projectTabInput.setAttribute("name", "pages");
  const projectTabLabel = document.createElement("label");
  projectTabLabel.textContent = projectName;
  projectTabLabel.setAttribute("for", projectName);
  projectTabInput.setAttribute("id", projectName);
  projectTab.appendChild(projectTabInput);
  projectTab.appendChild(projectTabLabel);
  domProjectsTabContainer.appendChild(projectTab);
  if (projectName !== "General") {
    addRemoveBtn(project, projectTab, removeProject, updateStorageFn);
  }
}
export function addRemoveBtn(
  project,
  projectTab,
  removeProject,
  updateStorageFn,
) {
  const removeBtn = document.createElement("button");
  const removeBtnImg = document.createElement("img");
  removeBtnImg.src = closeImg;
  removeBtn.classList.add("removeBtn");
  removeBtn.addEventListener("click", () => {
    const removeModal = document.createElement("dialog");
    const modalMsg = document.createElement("div");
    modalMsg.textContent = `Remove Project: ${project.projectName}`;
    const modalBtnContainer = document.createElement("div");
    modalBtnContainer.classList.add("modalBtnContainer");
    const modalYesBtn = document.createElement("button");
    modalYesBtn.textContent = "Yes";
    modalYesBtn.addEventListener("click", () => {
      removeProject(project);
      projectTab.remove();
      updateStorageFn();
      removeModal.close();
      removeModal.remove();
    });
    const modalNoBtn = document.createElement("button");
    modalNoBtn.addEventListener("click", () => {
      removeModal.close();
    });
    modalNoBtn.textContent = "No";
    modalBtnContainer.appendChild(modalYesBtn);
    modalBtnContainer.appendChild(modalNoBtn);
    removeModal.appendChild(modalMsg);
    removeModal.appendChild(modalBtnContainer);
    document.body.appendChild(removeModal);
    removeModal.showModal();
  });
  removeBtn.appendChild(removeBtnImg);
  projectTab.appendChild(removeBtn);
}
export function loadProjects(
  storage,
  projectTabContainer,
  removeProject,
  updateStorageFn,
) {
  for (let i = 0; i < storage.length; i++) {
    domProjectTabLoader(
      storage[i],
      projectTabContainer,
      removeProject,
      updateStorageFn,
    );
  }
}
