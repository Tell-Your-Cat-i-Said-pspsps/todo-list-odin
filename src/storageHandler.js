export function updateProjectsStorage(projectsLibrary) {
  localStorage.setItem("projects", JSON.stringify(projectsLibrary));
}

export function getProjectsStorage() {
  if (localStorage.getItem("projects") != null) {
    return JSON.parse(localStorage.getItem("projects"));
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
