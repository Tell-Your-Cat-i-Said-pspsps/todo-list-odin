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
  const getProjects = () => {
    return projectsStorage;
  };
  const getProjectName = (project) => {
    return project.projectName;
  };
  const getLastAddedProject = () => {
    return this.projectsStorage[this.projectsStorage.length - 1];
  };
  const addProject = (project) => {
    this.projectsStorage.push(project);
  };
  const createProject = (name) => {
    const newProject = new project(name);
    if (
      !this.projectsStorage.some((project) => {
        if (project.projectName === newProject.projectName) {
          return true;
        }
      }) &&
      /[\S\s]+[\S]+/.test(newProject.projectName)
    ) {
      addProject(newProject);
      return true;
    } else {
      console.log(
        "Project with similar name already exist in your projects library or is a null value",
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
    projectsStorage,
    getProjects,
    createProject,
    removeProject,
    getProjectName,
    updateLocalStorage,
    getLastAddedProject,
  };
}
