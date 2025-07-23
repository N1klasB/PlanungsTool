import React, { useState } from "react";
import { Task } from "../models/task";
import { linkify } from "../services/linkify.tsx";

interface TaskItemProps {
  task: Task;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  toggleCompletion,
  deleteTask,
}) => {
  const [isDescriptionOverlayVisible, setDescriptionOverlayVisible] =
    useState<boolean>(false);
  const [isSubtaskOverlayVisible, setSubtaskOverlayVisible] =
    useState<boolean>(false);

  const toggleOverlay = () => {
    setDescriptionOverlayVisible(!isDescriptionOverlayVisible);
  };

  const toggleSubtaskOverlay = () => {
    setSubtaskOverlayVisible(!isSubtaskOverlayVisible);
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks =
      task.subtasks?.map((st) => {
        if (st.subtaskId === subtaskId) {
          return { ...st, completed: !st.completed };
        }
        return st;
      }) || [];

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    };

    console.warn("Update Task logic here with:", updatedTask);
  };

  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };

  return (
    <>
      <li className={`task-item ${task.taskStatus ? "completed" : ""}`}>
        <div className="task-container">
          <div className="title-box">{task.title}</div>
          <div className="deadline-box">Deadline: {task.deadline || "-"}</div>
        </div>
        <div className="task-box">
          <span>Priority: {task.priority || "Not set"}</span>
        </div>
        <div className="task-box">
          <span>Estimated Time: {task.estimatedTime || "Not set"}</span>
        </div>
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="task-box">
            <span>{task.subtasks.length} Subtasks</span>
            <button className="view-subtasks" onClick={toggleSubtaskOverlay}>
              View
            </button>{" "}
          </div>
        )}
        <div className="task-box">
          <button className="toggle-description-button" onClick={toggleOverlay}>
            Show Description
          </button>
          <div className="task-box">
            <button
              className="toggle-completion-button"
              onClick={() => toggleCompletion(task.taskId)}
            >
              {task.taskStatus ? "Undo" : "Complete"}
            </button>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.taskId)}
            >
              Delete
            </button>
          </div>
        </div>
      </li>
      {isDescriptionOverlayVisible && (
        <div className="overlay" onClick={toggleOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h3>Description</h3>
            <p>{linkify(task.description || "No description available.")}</p>
            <button className="close-button" onClick={toggleOverlay}>
              Close
            </button>
          </div>
        </div>
      )}
      {isSubtaskOverlayVisible && (
        <div className="overlay" onClick={toggleSubtaskOverlay}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h3>Subtasks ({calculateProgress()}% done)</h3>
            <ul className="subtask-list">
              {task.subtasks?.map((st) => (
                <li key={st.subtaskId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(st.subtaskId)}
                    />
                    {st.title}
                  </label>
                </li>
              ))}
            </ul>
            <button className="close-button" onClick={toggleSubtaskOverlay}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
