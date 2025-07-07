import { Project } from "../models/project";

export const deleteProject = (projects: Project[], projectId: string): Project[] => {
    return projects.filter((project) => project.projectId !== projectId);
  };