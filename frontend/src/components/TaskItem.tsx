import React, { useState } from "react";
import { Task } from "../models/task";
import { linkify } from "../services/linkify.tsx";
import EditTaskOverlay from "./EditTaskOverlay.tsx";
import Subtasks from "./Subtasks.tsx";

interface TaskItemProps {
  task: Task;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  projects: Project[];
  onUpdateTask: (updatedTask: Task) => void;
  updateTaskBackend: (
    partialTask: Partial<Task> & { taskId: string }
  ) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  projects,
  toggleCompletion,
  deleteTask,
  onUpdateTask,
  updateTaskBackend,
}) => {
  const [isDescriptionOverlayVisible, setDescriptionOverlayVisible] =
    useState<boolean>(false);
  const [isSubtaskOverlayVisible, setSubtaskOverlayVisible] =
    useState<boolean>(false);
  const [isEditOverlayVisible, setEditOverlayVisible] =
    useState<boolean>(false);

  const toggleOverlay = () => {
    setDescriptionOverlayVisible(!isDescriptionOverlayVisible);
  };

  const toggleSubtaskOverlay = () => {
    setSubtaskOverlayVisible(!isSubtaskOverlayVisible);
  };

  const toggleEditOverlay = () => {
    setEditOverlayVisible(!isEditOverlayVisible);
  };

  const toggleSubtask = async (subtaskId: string) => {
    const updatedSubtasks =
      task.subtasks?.map((st) => {
        if (st.subtaskId === subtaskId) {
          return { ...st, subtaskStatus: !st.subtaskStatus };
        }
        return st;
      }) || [];

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
    };

    onUpdateTask(updatedTask);
  };

  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completedCount = task.subtasks.filter(
      (st) => st.subtaskStatus
    ).length;
    return Math.round((completedCount / task.subtasks.length) * 100);
  };

  return (
    <>
      <li className={`task-item ${task.taskStatus ? "completed" : ""}`}>
        <div className="task-header">
          <div className="clickable-title" onClick={toggleEditOverlay}>
            {task.title}
          </div>
          <div className="deadline-box">Deadline: {task.deadline || "-"}</div>
        </div>

        <div className="task-detail">
          <span>Priority: {task.priority || "Not set"}</span>
        </div>

        <div className="task-detail">
          <span>Estimated Time: {task.estimatedTime || "Not set"}</span>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="task-detail">
            <span>
              {task.subtasks.filter((st) => st.subtaskStatus).length}/
              {task.subtasks.length} Subtasks done
            </span>
            <button className="view-subtasks" onClick={toggleSubtaskOverlay}>
              View
            </button>
          </div>
        )}

        <div className="task-detail">
          <button className="toggle-description-button" onClick={toggleOverlay}>
            Show Description
          </button>
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

      {isSubtaskOverlayVisible && task.subtasks && (
        <Subtasks
          subtasks={task.subtasks}
          toggleSubtask={toggleSubtask}
          onClose={toggleSubtaskOverlay}
        />
      )}

      {isEditOverlayVisible && (
        <EditTaskOverlay
          task={task}
          projects={projects}
          onClose={toggleEditOverlay}
          onSave={async (updatedFields: Partial<Task>) => {
            const hasChanges = Object.keys(updatedFields).some(
              (key) => (task as any)[key] !== (updatedFields as any)[key]
            );
            if (!hasChanges) {
              toggleEditOverlay();
              return;
            }
            const updatedTask = { ...task, ...updatedFields };
            onUpdateTask(updatedTask);
            await updateTaskBackend({
              taskId: task.taskId,
              ...updatedFields,
            });
            toggleEditOverlay();
          }}
        />
      )}
    </>
  );
};

export default TaskItem;
