export class project {
  constructor(name) {
    this.projectName = name;
    this.todos = [];
  }
}
export function projectsManager(projectsStorage) {
  this.projectsStorage = projectsStorage;
  const updateLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(this.projectsStorage));
  };
  const getProjectsStorage = () => {
    return this.projectsStorage;
  };
  const createProject = (name) => {
    if (
      !this.projectsStorage.some((project) => {
        if (project.projectName === name) {
          return true;
        }
      }) &&
      /[\S\s]+[\S]+/.test(name)
    ) {
      this.projectsStorage.push(new project(name));
      return true;
    } else {
      console.log(
        "Project with similar name already exist in your projects library or Entered name is a null value",
      );
      return false;
    }
  };
  const removeProject = (project) => {
    this.projectsStorage = this.projectsStorage.filter((storedProject) => {
      if (storedProject.projectName != project.projectName) {
        return true;
      }
    });
  };

  return {
    getProjectsStorage,
    createProject,
    removeProject,
    updateLocalStorage,
  };
}
