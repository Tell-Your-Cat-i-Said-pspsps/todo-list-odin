import { compareAsc } from "date-fns";
import { todo } from "./todoHandler";

export function updateProjectsStorage(projectsLibrary) {
  localStorage.setItem("projects", JSON.stringify(projectsLibrary));
}

export function getProjectsStorage() {
  if (localStorage.getItem("projects") != null) {
    const storedProjects = JSON.parse(localStorage.getItem("projects"));
    console.log(Array.isArray(storedProjects));
    for (let i = 0; i < storedProjects.length; i++) {
      console.log(Array.isArray(storedProjects[i].todos));
      console.log(storedProjects[i].todos.length);
      if (
        Array.isArray(storedProjects[i].todos) &&
        storedProjects[i].todos.length
      ) {
        for (let j = 0; j < storedProjects[i].todos.length; j++) {
          storedProjects[i].todos[j] = Object.assign(
            new todo(),
            storedProjects[i].todos[j],
          );
          console.log(storedProjects[i].todos[j] instanceof todo);
        }
      }
      storedProjects[i].todos = storedProjects[i].todos.sort(
        (firstTodo, secondTodo) => {
          return compareAsc(firstTodo.dueDate, secondTodo.dueDate);
        },
      );
    }
    return storedProjects;
  } else {
    localStorage.setItem(
      "projects",
      JSON.stringify([
        {
          projectName: "General",
          todos: [],
        },
      ]),
    );
    return JSON.parse(localStorage.getItem("projects"));
  }
}
