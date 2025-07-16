import React from "react";
import { Project } from "../models/project";
import ProjectItem from "../components/ProjectItem.tsx";
import { Task } from "../models/task";

interface Props {
  projects: Project[];
  deleteProject: (id: string) => void;
  tasks: Task[];
}

const ProjectView: React.FC<Props> = ({ projects, deleteProject, tasks }) => {
  return (
    <div>
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectItem
            key={project.projectId}
            project={project}
            deleteProject={deleteProject}
            tasks={tasks.filter((task) => task.projectId === project.projectId)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectView;
