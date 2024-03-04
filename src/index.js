import "./style.css";
import { projectsManager } from "./projectsHandler.js";
import * as domHandler from "./domHandler.js";
import { getProjectsStorage } from "./storageHandler.js";
import { removeTodoFn, submitTodoFn } from "./todoHandler.js";
const addBtn = document.querySelector(".addBtn");
const addProjectModal = document.querySelector(".addProjectModal");
const closeModalBtn = document.querySelector(".closeBtn");
const sidebarProjectsArea = document.querySelector(".projects");
const modalAddProjectBtn = document.querySelector("#modalAddProjectBtn");
const projectNameInput = document.querySelector("#projectNameInput");
const userProjectsStorage = getProjectsStorage();
const userProjectManager = new projectsManager(userProjectsStorage);
const projectDisplayArea = document.querySelector(".display");

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
  userProjectManager.getProjectsStorage(),
  sidebarProjectsArea,
  userProjectManager.removeProject,
  userProjectManager.updateLocalStorage,
  projectDisplayArea,
  submitTodoFn,
  removeTodoFn,
);
// append new project in dom and in storage
function appendNewProject() {
  userProjectManager.updateLocalStorage();
  const userProjects = userProjectManager.getProjectsStorage();
  domHandler.domProjectTabLoader(
    userProjects[userProjects.length - 1],
    sidebarProjectsArea,
    userProjectManager.removeProject,
    userProjectManager.updateLocalStorage,
    projectDisplayArea,
    submitTodoFn,
    removeTodoFn,
  );
  addProjectModal.close();
  projectNameInput.value = "";
}
