import React from "react";
import { Project } from "../models/project";
import { Task } from "../models/task";

interface ProjectItemProps {
  project: Project;
  deleteProject: (id: string) => void;
  tasks?: Task[];
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  deleteProject,
  tasks = [],
}) => {
  const tasksForProject = tasks.filter(
    (task) => task.projectId === project.projectId
  );

  return (
    <div className="project-item">
      <div className="project-header">
        <div className="project-title">{project.title}</div>
        <div className="project-info">
          <span>
            Start:{" "}
            {project.startDate
              ? new Date(project.startDate).toLocaleString("de-DE")
              : "-"}
          </span>
          <span>
            End:{" "}
            {project.endDate
              ? new Date(project.endDate).toLocaleString("de-DE")
              : "-"}
          </span>
          <span>{tasksForProject.length} Tasks</span>
        </div>
        <div className="project-actions">
          <button
            className="delete-button"
            onClick={() => deleteProject(project.projectId)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="project-description">
        <p>{project.description || "No description provided."}</p>
      </div>
      <div className="project-tasks">
        <h4>Tasks</h4>
        {tasksForProject.length > 0 ? (
          <ul>
            {tasksForProject.map((task) => (
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
