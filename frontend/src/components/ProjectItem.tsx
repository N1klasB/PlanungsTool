import React from "react";
import { Project } from "../models/project";
import { Task } from "../models/task";

interface ProjectItemProps {
  project: Project;
  deleteProject: (id: string) => void;
  tasks?: Task[];
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, deleteProject, tasks = [] }) => {
  const tasksForProject = tasks.filter(task => task.projectId === project.projectId);
  return (
    <div className="project-item">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
      <button onClick={() => deleteProject(project.projectId)}>Delete Project</button>
      <div className="task-list">
        <h4>Tasks:</h4>
        {tasksForProject.length > 0 ? (
          <ul>
            {tasksForProject.map(task => (
              <li key={task.taskId}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
