import React, { useState } from "react";
import { Task } from "../models/task";
import { generateId } from "../services/idGenerator.ts";
import { Project } from "../models/project";
import { Subtask } from "../models/subtask";

interface AddTaskProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
}

const AddTask: React.FC<AddTaskProps> = ({
  tasks,
  setTasks,
  projects = [] as Project[],
}) => {
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>(""); //Kapselung in eigne Task klasse
  const [taskDeadline, setTaskDeadline] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<number>("");
  const [taskEstimatedEffort, setTaskEstimatedEffort] = useState<number>("");
  const [taskCreationDate, setTaskCreationDate] = useState<string>(
    new Date().toISOString()
  );
  const [taskLastModified, setTaskLastModified] = useState<string>(
    new Date().toISOString()
  );
  const [projectId, setProjectId] = useState<string>("");

  const addTask = () => {
    if (!taskTitle) {
      alert("Please enter a task title.");
      return;
    }
    const taskId = generateId();
    const newTask = {
      taskId: taskId,
      title: taskTitle,
      taskStatus: false,
      deadline: taskDeadline || "",
      description: taskDescription || "",
      priority: taskPriority,
      projectId: projectId,
      estimatedEffort: taskEstimatedEffort || "",
      creationDate: taskCreationDate,
      lastModified: taskLastModified,
      subtasks: subtasks,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskDeadline("");
    setTaskDescription("");
    setTaskPriority();
    setProjectId("");
    setTaskEstimatedEffort(0);
    setSubtaskTitle("");
    setSubtasks([]);
    setTaskEstimatedEffort();
    setTaskCreationDate(new Date().toISOString());
    setTaskLastModified(new Date().toISOString());
  };

  const addSubtask = () => {
    if (!subtaskTitle) return;
    const newSubtask: Subtask = {
      subtaskId: generateId(),
      subtaskTitle: subtaskTitle,
      subtaskStatus: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setSubtaskTitle("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.subtaskId !== id));
  };

  return (
    <div className="add-task-container">
      <h2>Create a New Task</h2>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <label htmlFor="taskDeadline">Deadline:</label>
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
              {st.subtaskTitle}
              <button
                onClick={() => removeSubtask(st.subtaskId)}
                style={{
                  color: "white",
                  backgroundColor: "red",
                  marginLeft: "10px",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <label>
        Priority:
        <select
          value={taskPriority}
          onChange={(e) =>
            setTaskPriority(e.target.value === "" ? "" : +e.target.value)
          }
        >
          <option value="">N/A</option>
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
          value={taskEstimatedEffort}
          min={1}
          onChange={(e) =>
            setTaskEstimatedEffort(e.target.value === "" ? 1 : +e.target.value)
          }
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
      <button onClick={addTask}>Add Task</button>
    </div>
  );
};

export default AddTask;
