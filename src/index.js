import "./style.css";
import { projectsManager } from "./projectsHandler.js";
import * as domHandler from "./domHandler.js";
import { updateProjectsStorage, getProjectsStorage } from "./storageHandler.js";
import { todo } from "./todoHandler.js";
const addBtn = document.querySelector(".addBtn");
const addProjectModal = document.querySelector(".addProjectModal");
const closeModalBtn = document.querySelector(".closeBtn");
const sidebarProjectsArea = document.querySelector(".projects");
const modalAddProjectBtn = document.querySelector("#modalAddProjectBtn");
const projectNameInput = document.querySelector("#projectNameInput");
const userProjectsStorage = getProjectsStorage();
console.log(userProjectsStorage);
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
  userProjectManager.projectsStorage,
  sidebarProjectsArea,
  userProjectManager.removeProject,
  userProjectManager.updateLocalStorage,
  projectDisplayArea,
  submitTodo,
  removeTodoFn,
);
// append new project in dom and in storage
function appendNewProject() {
  updateProjectsStorage(userProjectManager.projectsStorage);
  domHandler.domProjectTabLoader(
    userProjectManager.projectsStorage[
      userProjectManager.projectsStorage.length - 1
    ],
    sidebarProjectsArea,
    userProjectManager.removeProject,
    userProjectManager.updateLocalStorage,
    projectDisplayArea,
    submitTodo,
    removeTodoFn,
  );
  addProjectModal.close();
  projectNameInput.value = "";
}

function submitTodo(name, description, dueDate, priority, element) {
  if (Array.isArray(element)) {
    element.push(new todo(name, dueDate, description, priority));
  } else if (element instanceof todo) {
    console.log(element instanceof todo);
    element.name = name;
    element.dueDate = dueDate;
    element.description = description;
    element.priority = priority;
  }
}
function removeTodoFn(todos, todo) {
  todos = todos.filter((projectTodo) => {
    if (projectTodo.name != todo.name) {
      return true;
    }
  });
  console.log(todos);
  return todos;
}
