import React, { useState } from "react";
import { Project } from "../models/project.ts";
import { generateId } from "../services/idGenerator.ts";

interface AddProjectProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const AddProject: React.FC<AddProjectProps> = ({ projects, setProjects }) => {
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const addProject = () => {
    if (!projectTitle.trim()) {
      alert("Project title is required.");
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after the end date.");
      return;
    }

    const projectId = generateId();

    const newProject: Project = {
      projectId: projectId,
      title: projectTitle,
      description: projectDescription,
      tasks: [],
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || "",
    };

    setProjects([...projects, newProject]);
    setProjectTitle("");
    setProjectDescription("");
    setStartDate("");
    setEndDate("");
  };

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    alert("Start date cannot be after the end date.");
    return;
  }

  return (
    <div className="add-project-container">
      <h2>Create New Project</h2>
      <input
        type="text"
        placeholder="Project Title"
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />
      <label htmlFor="projectStart">Project Start:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label htmlFor="projectEnd">Project End:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={addProject}>Add Project</button>
    </div>
  );
};

export default AddProject;
