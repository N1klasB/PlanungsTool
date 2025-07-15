import React from "react";
import { Project } from "../models/project";
import ProjectItem from "../components/ProjectItem.tsx";

interface Props {
  projects: Project[];
  deleteProject: (id: string) => void;
}

const ProjectView: React.FC<Props> = ({ projects, deleteProject }) => {
  return (
    <div>
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectItem
            key={project.projectId}
            project={project}
            deleteProject={deleteProject}
            tasks={[]}
          />
        ))}
      </div>
    </div>
  );
};


export default ProjectView;