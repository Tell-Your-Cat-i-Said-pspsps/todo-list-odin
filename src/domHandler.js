import deleteImg from "./deleteImg.svg";
import editImg from "./square-edit-outline.svg";
import closeImg from "./close.svg";
import { enGB } from "date-fns/locale/en-GB";
import {
  compareAsc,
  format,
  formatDistanceToNow,
  formatRelative,
  isPast,
  isThisWeek,
  isToday,
  isWithinInterval,
  subWeeks,
} from "date-fns";
export function domProjectTabLoader(
  project,
  domProjectsTabContainer,
  removeProject,
  updateStorageFn,
  projectDisplayArea,
  submitFn,
  removeTodoFn,
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
  projectTabInput.addEventListener("change", () => {
    if (projectTabInput.checked) {
      projectDisplayArea.innerHTML = "";
      loadProjectPage(
        project,
        projectDisplayArea,
        submitFn,
        updateStorageFn,
        removeTodoFn,
      );
    }
  });
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
      removeModal.remove();
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
  projectDisplayArea,
  submitFn,
  removeTodoFn,
) {
  for (let i = 0; i < storage.length; i++) {
    domProjectTabLoader(
      storage[i],
      projectTabContainer,
      removeProject,
      updateStorageFn,
      projectDisplayArea,
      submitFn,
      removeTodoFn,
    );
  }
}
export function loadProjectPage(
  project,
  display,
  submitFn,
  updateStorageFn,
  removeTodoFn,
) {
  try {
    display.classList.add("projectDisplay");
    project.todos;
    const projectPageTitle = document.createElement("h1");
    projectPageTitle.classList.add("pageTitle");
    projectPageTitle.textContent = `Project: ${project.projectName}`;
    const projectPageTodoArea = document.createElement("div");
    projectPageTodoArea.classList.add("projectTodoArea");
    if (Array.isArray(project.todos) && project.todos.length) {
      loadProjectTodos(
        project,
        projectPageTodoArea,
        updateStorageFn,
        submitFn,
        removeTodoFn,
      );
    } else {
      projectPageTodoArea.textContent = "No Todos To Display";
    }
    const addTodoBtn = document.createElement("button");
    addTodoBtn.classList.add("Btn");
    addTodoBtn.textContent = "New Todo";
    addTodoBtn.addEventListener("click", () => {
      openTodoModal(
        submitFn,
        updateStorageFn,
        project,
        projectPageTodoArea,
        removeTodoFn,
      );
    });
    display.appendChild(projectPageTitle);
    display.appendChild(addTodoBtn);
    display.appendChild(projectPageTodoArea);
  } catch (err) {
    loadErrorModal(err);
  }
}
function loadErrorModal(err) {
  const errorModal = document.createElement("dialog");
  errorModal.classList.add("errorModal");
  const errorModalMsg = document.createElement("h2");
  errorModalMsg.textContent = `Something went wrong :${err.message}`;
  const closeErrorModalBtn = document.createElement("button");
  closeErrorModalBtn.textContent = "Close";
  closeErrorModalBtn.classList.add("Btn");
  closeErrorModalBtn.addEventListener("click", () => {
    errorModal.close();
  });
  errorModal.appendChild(errorModalMsg);
  errorModal.appendChild(closeErrorModalBtn);
  document.body.appendChild(errorModal);
  errorModal.showModal();
}
function loadTodo(
  todo,
  project,
  updateStorageFn,
  todosArea,
  submitFn,
  removeTodoFn,
) {
  const todoCard = loadTodoCard(todo);
  const removeBtn = document.createElement("button");
  const removeBtnImg = document.createElement("img");
  removeBtn.classList.add("removeTodoBtn");
  removeBtnImg.classList.add("removeTodoBtnImg");
  removeBtnImg.src = deleteImg;
  removeBtn.appendChild(removeBtnImg);
  const editTodoBtn = document.createElement("button");
  editTodoBtn.classList.add("editTodoBtn");
  const editTodoBtnImg = document.createElement("img");
  editTodoBtnImg.classList.add("editTodoBtnImg");
  editTodoBtnImg.src = editImg;
  editTodoBtn.appendChild(editTodoBtnImg);
  removeBtn.addEventListener("click", () => {
    try {
      project.todos = removeTodoFn(project.todos, todo);
      if (project.todos.length) {
        loadProjectTodos(
          project,
          todosArea,
          updateStorageFn,
          submitFn,
          removeTodoFn,
        );
      } else {
        todosArea.textContent = "No Todos To Display";
      }
      updateStorageFn();
    } catch (err) {
      loadErrorModal(err);
    }
  });
  editTodoBtn.addEventListener("click", () => {
    openTodoModal(
      submitFn,
      updateStorageFn,
      project,
      todosArea,
      removeTodoFn,
      todo,
    );
  });
  todoCard.appendChild(editTodoBtn);
  todoCard.appendChild(removeBtn);
  return todoCard;
}
function loadProjectTodos(
  project,
  todosArea,
  updateStorageFn,
  submitFn,
  removeTodoFn,
) {
  todosArea.innerHTML = "";
  for (let i = 0; i < project.todos.length; i++) {
    todosArea.appendChild(
      loadTodo(
        project.todos[i],
        project,
        updateStorageFn,
        todosArea,
        submitFn,
        removeTodoFn,
      ),
    );
  }
}
function openTodoModal(
  submitFn,
  updateStorageFn,
  project,
  todosArea,
  removeTodoFn,
  todo,
) {
  let submitTo = project.todos;
  const todoModal = document.createElement("dialog");
  todoModal.classList.add("modal");
  const todoModalTitle = document.createElement("h2");
  todoModalTitle.textContent = "Create a New Todo";
  const todoName = document.createElement("div");
  todoName.classList.add("inputGrp");
  const todoNameInput = document.createElement("input");
  todoNameInput.setAttribute("type", "text");
  todoNameInput.setAttribute("id", "todoNameInput");
  const todoNameInputLabel = document.createElement("label");
  todoNameInputLabel.setAttribute("for", "todoNameInput");
  todoNameInputLabel.textContent = "Name: ";
  todoName.appendChild(todoNameInputLabel);
  todoName.appendChild(todoNameInput);
  const todoDescription = document.createElement("div");
  todoDescription.classList.add("inputGrp");
  const todoDescriptionTextArea = document.createElement("textarea");
  todoDescriptionTextArea.id = "todoDescriptionTextArea";
  const todoDescriptionTextAreaLabel = document.createElement("label");
  todoDescriptionTextAreaLabel.setAttribute("for", todoDescriptionTextArea.id);
  todoDescriptionTextAreaLabel.textContent = "Description: ";
  todoDescription.appendChild(todoDescriptionTextAreaLabel);
  todoDescription.appendChild(todoDescriptionTextArea);
  //create Due Date input Area
  const todoDueDate = document.createElement("div");
  todoDueDate.classList.add("inputGrp");
  const todoDueDateInput = document.createElement("input");
  todoDueDateInput.type = "date";
  todoDueDateInput.valueAsDate = new Date();
  todoDueDateInput.id = "todoDueDateInput";
  const todoDueDateInputLabel = document.createElement("label");
  todoDueDateInputLabel.setAttribute("for", todoDueDateInput.id);
  todoDueDateInputLabel.textContent = "Due Date: ";
  todoDueDate.appendChild(todoDueDateInputLabel);
  todoDueDate.appendChild(todoDueDateInput);
  //create priority input area
  const todoPriority = document.createElement("div");
  todoPriority.classList.add("priorityOptionsArea");
  const prioritiesArray = ["Normal", "Medium", "High"];
  // create inputs of radio type for each priority option
  for (let priority of prioritiesArray) {
    const priorityInputGrp = document.createElement("div");
    const priorityInput = document.createElement("input");
    priorityInput.type = "radio";
    priorityInput.id = priority;
    priorityInput.name = "priority";
    priorityInput.value = priority;
    const priorityInputLabel = document.createElement("label");
    priorityInputLabel.classList.add(`label${priority}`);
    priorityInputLabel.setAttribute("for", priorityInput.id);
    priorityInputLabel.textContent = priority;
    priorityInputGrp.appendChild(priorityInput);
    priorityInputGrp.appendChild(priorityInputLabel);
    todoPriority.appendChild(priorityInputGrp);
  }
  todoPriority.querySelector(`input[value='Normal']`).checked = true;
  if (todo != null) {
    todoModalTitle.textContent = `Edit Todo: ${todo.name}`;
    todoNameInput.value = todo.name;
    todoDescriptionTextArea.value = todo.description;
    todoDueDateInput.value = todo.dueDate;
    todoPriority.querySelector(`input[value=${todo.priority}]`).checked = true;
  }
  const todoModalSubmitBtn = document.createElement("button");
  todoModalSubmitBtn.textContent = "Submit";
  todoModalSubmitBtn.classList.add("Btn");
  todoModalSubmitBtn.addEventListener("click", () => {
    try {
      if (todo != null) {
        submitFn(
          todoNameInput.value,
          todoDescriptionTextArea.value,
          todoDueDateInput.value,
          todoPriority.querySelector("input[name='priority']:checked").value,
          todo,
        );
      } else {
        submitFn(
          todoNameInput.value,
          todoDescriptionTextArea.value,
          todoDueDateInput.value,
          todoPriority.querySelector("input[name='priority']:checked").value,
          submitTo,
        );
      }
      updateStorageFn();
      loadProjectTodos(
        project,
        todosArea,
        updateStorageFn,
        submitFn,
        removeTodoFn,
      );
      todoModal.close();
      todoModal.remove();
    } catch (err) {
      loadErrorModal(err);
    }
  });
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("closeBtn");
  const closeBtnImg = document.createElement("img");
  closeBtnImg.src = closeImg;
  closeBtnImg.classList.add("closeBtnImg");
  closeBtn.addEventListener("click", () => {
    todoModal.close();
    todoModal.remove();
  });
  todoModal.appendChild(todoModalTitle);
  todoModal.appendChild(todoName);
  todoModal.appendChild(todoDescription);
  todoModal.appendChild(todoDueDate);
  todoModal.appendChild(todoPriority);
  todoModal.appendChild(todoModalSubmitBtn);
  todoModal.appendChild(closeBtn);
  document.body.appendChild(todoModal);
  todoModal.showModal();
}
export function loadPage(storage, display, condition) {
  display.innerHTML = "";
  display.classList.remove("projectDisplay");
  for (let i = 0; i < storage.length; i++) {
    if (Array.isArray(storage[i].todos) && storage[i].todos.length) {
      if (
        storage[i].todos.some((todo) => {
          if (condition(todo.dueDate)) {
            return true;
          }
        })
      ) {
        const projectTodayTodosArea = document.createElement("div");
        const projectTodayTodosAreaTitle = document.createElement("h1");
        projectTodayTodosAreaTitle.textContent = `Project: ${storage[i].projectName}`;
        const projectTodayTodosAreaBody = document.createElement("div");
        projectTodayTodosAreaBody.classList.add("projectTodayTodoArea");
        const projectTodayTodos = storage[i].todos.filter((projectTodo) => {
          if (condition(projectTodo.dueDate)) {
            return true;
          }
        });

        for (let j = 0; j < projectTodayTodos.length; j++) {
          projectTodayTodosAreaBody.appendChild(
            loadTodoCard(projectTodayTodos[j]),
          );
        }
        projectTodayTodosArea.appendChild(projectTodayTodosAreaTitle);
        projectTodayTodosArea.appendChild(projectTodayTodosAreaBody);
        display.appendChild(projectTodayTodosArea);
      }
    }
  }
}
function loadTodoCard(todo) {
  const name = todo.name;
  const dueDate = todo.dueDate;
  const description = todo.description;
  const priority = todo.priority;
  const todoCard = document.createElement("div");
  todoCard.classList.add("todoCard");
  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("cardTitle");
  cardTitle.textContent = name;
  const cardBody = document.createElement("div");
  cardBody.classList.add("cardBody");
  const todoDescription = document.createElement("div");
  const todoDescriptionLabel = document.createElement("div");
  todoDescriptionLabel.classList.add("cardFieldLabel");
  todoDescriptionLabel.textContent = "Description:";
  const todoDescriptionBody = document.createElement("div");
  todoDescriptionBody.classList.add("todoDescription");
  todoDescriptionBody.textContent = description;
  todoDescription.appendChild(todoDescriptionLabel);
  todoDescription.appendChild(todoDescriptionBody);
  const todoPriorityField = document.createElement("div");
  todoPriorityField.classList.add("cardField");
  const todoPriorityLabel = document.createElement("span");
  todoPriorityLabel.classList.add("cardFieldLabel");
  todoPriorityLabel.textContent = "Priority: ";
  const todoPriority = document.createElement("span");
  todoPriority.classList = "";
  todoPriority.classList.add(priority);
  todoPriority.textContent = priority;
  todoPriorityField.appendChild(todoPriorityLabel);
  todoPriorityField.appendChild(todoPriority);
  const todoDueDateField = document.createElement("div");
  todoDueDateField.classList.add("cardField");
  const todoDueDateFieldLabel = document.createElement("span");
  todoDueDateFieldLabel.classList.add("cardFieldLabel");
  todoDueDateFieldLabel.textContent = "Due Date: ";
  const todoDueDate = document.createElement("span");
  todoDueDate.classList.add("todoDueDate");
  if (isToday(dueDate)) {
    todoDueDate.textContent = `${dueDate} (Today)`;
  } else if (
    isThisWeek(dueDate) ||
    isWithinInterval(dueDate, {
      start: subWeeks(new Date(), 1),
      end: new Date(),
    })
  ) {
    const formatRelativeLocale = {
      lastWeek: "'Last' eeee",
      yesterday: "'Yesterday'",
      today: "'Today'",
      tomorrow: "'Tomorrow'",
      nextWeek: "'Next' eeee",
      other: "dd.MM.yyyy",
    };

    const locale = {
      ...enGB,
      formatRelative: (token) => formatRelativeLocale[token],
    };

    todoDueDate.textContent = `${dueDate} (${formatRelative(dueDate, new Date(), { locale })})`;
  } else {
    todoDueDate.textContent = `${dueDate} (${formatDistanceToNow(dueDate)})`;
  }
  todoDueDateField.appendChild(todoDueDateFieldLabel);
  todoDueDateField.appendChild(todoDueDate);
  const todoStatus = document.createElement("div");
  todoStatus.classList.add("inputGrp");
  const todoStatusInput = document.createElement("input");
  todoStatusInput.type = "checkbox";
  todoStatusInput.id = `${name}Status`;
  if (todo.isDone) {
    todoStatusInput.checked = true;
  }
  if (!isPast(dueDate) || isToday(dueDate)) {
    todoStatusInput.addEventListener("change", () => {
      todo.doneToggle();
      console.log(todo.isDone);
    });
  } else if (!todo.isDone) {
    todoStatusInput.disabled = true;
    cardTitle.textContent = `${name} (Past its due date)`;
  } else {
    todoStatusInput.disabled = true;
  }

  const todoStatusLabel = document.createElement("label");
  todoStatusLabel.setAttribute("for", todoStatusInput.id);
  todoStatusLabel.textContent = "Done: ";
  todoStatus.appendChild(todoStatusLabel);
  todoStatus.appendChild(todoStatusInput);
  cardBody.appendChild(todoDescription);
  cardBody.appendChild(todoPriorityField);
  cardBody.appendChild(todoDueDateField);
  todoCard.appendChild(cardTitle);
  todoCard.appendChild(cardBody);
  todoCard.appendChild(todoStatus);
  return todoCard;
}
