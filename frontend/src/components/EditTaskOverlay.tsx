import React, { useState } from "react";
import { Task } from "../models/task";

interface Subtask {
  subtaskId: string;
  title: string;
  completed: boolean;
}

interface Project {
  projectId: string;
  title: string;
}

interface EditTaskOverlayProps {
  task: Task;
  projects: Project[];
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const EditTaskOverlay: React.FC<EditTaskOverlayProps> = ({
  task,
  projects,
  onClose,
  onSave,
}) => {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDeadline, setTaskDeadline] = useState(task.deadline || "");
  const [taskDescription, setTaskDescription] = useState(task.description || "");
  const [taskPriority, setTaskPriority] = useState(task.priority || 1);
  const [taskEstimatedEffort, setTaskEstimatedEffort] = useState(task.estimatedTime || 1);
  const [projectId, setProjectId] = useState(task.projectId || "");
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const addSubtask = () => {
    if (subtaskTitle.trim() === "") return;
    const newSubtask: Subtask = {
      subtaskId: crypto.randomUUID(),
      title: subtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setSubtaskTitle("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.subtaskId !== id));
  };

  const saveTask = () => {
    const updatedTask: Task = {
      ...task,
      title: taskTitle,
      deadline: taskDeadline,
      description: taskDescription,
      priority: taskPriority,
      estimatedTime: taskEstimatedEffort,
      projectId: projectId || null,
      subtasks: subtasks,
    };
    onSave(updatedTask);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content add-task-container" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <label>Deadline:</label>
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <div className="subtasks-section">
          <h4>Subtasks</h4>
          <input
            type="text"
            placeholder="Subtask title"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
          />
          <button onClick={addSubtask}>Add Subtask</button>
          <ul>
            {subtasks.map((st) => (
              <li key={st.subtaskId}>
                {st.title}
                <button onClick={() => removeSubtask(st.subtaskId)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <label>
          Priority:
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(+e.target.value)}
          >
            <option value={1}>1 (Low)</option>
            <option value={2}>2</option>
            <option value={3}>3 (Medium)</option>
            <option value={4}>4</option>
            <option value={5}>5 (High)</option>
          </select>
        </label>
        <label>
          Estimated Effort (in hours):
          <input
            type="number"
            min={1}
            value={taskEstimatedEffort}
            onChange={(e) => setTaskEstimatedEffort(+e.target.value)}
          />
        </label>
        <label>
          Assign to Project:
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">None</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={saveTask}>Save Changes</button>
          <button className="delete-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskOverlay;
