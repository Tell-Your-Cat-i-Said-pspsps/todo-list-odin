import { compareAsc, formatDistanceToNow, isPast } from "date-fns";
export class todo {
  constructor(name, dueDate, description, priority) {
    this.name = name || "No Name";
    this.dueDate = dueDate || new Date();
    this.description = description || "No Description";
    this.priority = priority || "Normal";
    this.isDone = false;
  }
  doneToggle() {
    if (!isPast(this.dueDate)) {
      this.isDone = !this.isDone;
      return this.isDone;
    } else {
      console.log("Cant change done status the todo is past its due date");
    }
  }
}
//this function will add a new todo to todos list or edit an existing todo
export function submitTodoFn(name, description, dueDate, priority, element) {
  if (Array.isArray(element)) {
    element.push(new todo(name, dueDate, description, priority));
  } else if (element instanceof todo) {
    element.name = name;
    element.dueDate = dueDate;
    element.description = description;
    element.priority = priority;
  }
}
//this Fn will remove a Todo from todos Array
export function removeTodoFn(todos, todo) {
  todos = todos.filter((projectTodo) => {
    if (projectTodo.name != todo.name) {
      return true;
    }
  });
  return todos;
}
