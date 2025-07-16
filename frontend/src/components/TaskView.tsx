import React from "react";
import { Task } from "../models/task";
import TaskItem from "../components/TaskItem.tsx";

interface Props {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskView: React.FC<Props> = ({ tasks, toggleCompletion, deleteTask }) => {
  const pendingTasks = tasks.filter((task) => !task.taskStatus);
  const completedTasks = tasks.filter((task) => task.taskStatus);

  return (
    <div>
      <div className="pendingTasks">
        <h2>Pending Tasks</h2>
        <ul className="task-list">
          {pendingTasks.map((task) => (
            <TaskItem
              key={task.taskId}
              task={task}
              toggleCompletion={toggleCompletion}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
      <div className="completedTasks">
        <h2>Completed Tasks</h2>
        <ul className="task-list completed">
          {completedTasks.map((task) => (
            <TaskItem
              key={task.taskId}
              task={task}
              toggleCompletion={toggleCompletion}
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskView;
