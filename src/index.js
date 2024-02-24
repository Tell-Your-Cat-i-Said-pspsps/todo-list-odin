import "./style.css";
import { projectsManager, project } from "./projectsHandler.js";
import * as domHandler from "./domHandler.js";
import { updateProjectsStorage, getProjectsStorage } from "./storageHandler.js";
const addBtn = document.querySelector(".addBtn");
const addProjectModal = document.querySelector(".addProjectModal");
const closeModalBtn = document.querySelector(".closeBtn");
const sidebarProjectsArea = document.querySelector(".projects");
const modalAddProjectBtn = document.querySelector("#modalAddProjectBtn");
const projectNameInput = document.querySelector("#projectNameInput");
const userProjectsStorage = getProjectsStorage();
const userProjectManager = new projectsManager(userProjectsStorage);

addBtn.addEventListener("click", () => {
  addProjectModal.showModal();
});
closeModalBtn.addEventListener("click", () => {
  addProjectModal.close();
});
modalAddProjectBtn.addEventListener("click", () => {
  if (userProjectManager.createProject(projectNameInput.value)) {
    appendNewProject();
  }
});

//load all project that are already in user storage
domHandler.loadProjects(
  userProjectManager.projectsStorage,
  sidebarProjectsArea,
  userProjectManager.removeProject,
  userProjectManager.updateLocalStorage,
);
// append new project in dom and in storage
function appendNewProject() {
  updateProjectsStorage(userProjectManager.projectsStorage);
  domHandler.domProjectTabLoader(
    userProjectManager.getLastAddedProject(),
    sidebarProjectsArea,
    userProjectManager.removeProject,
    userProjectManager.updateLocalStorage,
  );
  addProjectModal.close();
  projectNameInput.value = "";
}
