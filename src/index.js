import "./style.css";
import { projectsManager } from "./projectsHandler.js";
import * as domHandler from "./domHandler.js";
import { getProjectsStorage } from "./storageHandler.js";
import { removeTodoFn, submitTodoFn } from "./todoHandler.js";
import { isThisWeek, isToday } from "date-fns";
const addBtn = document.querySelector(".addBtn");
const addProjectModal = document.querySelector(".addProjectModal");
const closeModalBtn = document.querySelector(".closeBtn");
const sidebarProjectsArea = document.querySelector(".projects");
const modalAddProjectBtn = document.querySelector("#modalAddProjectBtn");
const projectNameInput = document.querySelector("#projectNameInput");
const userProjectsStorage = getProjectsStorage();
const userProjectManager = new projectsManager(userProjectsStorage);
const displayArea = document.querySelector(".display");
const todayTab = document.querySelector("#today");
const thisWeekTab = document.querySelector("#this-week");
const homeTab = document.querySelector("#home");

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
  displayArea,
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
    displayArea,
    submitTodoFn,
    removeTodoFn,
  );
  addProjectModal.close();
  projectNameInput.value = "";
}
homeTab.addEventListener("change", () => {
  if (homeTab.checked) {
    domHandler.loadHomePage(
      userProjectManager.getProjectsStorage(),
      displayArea,
    );
  }
});

//load Today Todos For Each Project

todayTab.addEventListener("change", () => {
  if (todayTab.checked) {
    domHandler.loadPage(
      userProjectManager.getProjectsStorage(),
      displayArea,
      isToday,
    );
  }
});
thisWeekTab.addEventListener("click", () => {
  if (thisWeekTab.checked) {
    domHandler.loadPage(
      userProjectManager.getProjectsStorage(),
      displayArea,
      isThisWeek,
    );
  }
});

homeTab.checked = true;
domHandler.loadHomePage(userProjectManager.getProjectsStorage(), displayArea);
