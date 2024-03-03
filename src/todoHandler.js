import { compareAsc, formatDistanceToNow } from "date-fns";
export class todo {
  constructor(
    name,
    dueDate,
    description = "No Description",
    priority = "normal",
  ) {
    this.name = name;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
  }
}
