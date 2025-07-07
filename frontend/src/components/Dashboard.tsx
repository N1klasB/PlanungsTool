import React, { useState } from "react";
import { Task } from "../models/task";
import TaskItem from "./TaskItem.tsx";
import { DateToTime } from "../services/dateToTime.ts"


interface DashboardProps{
    tasks: Task[];
    toggleCompletion: (id: string) => void;
    deleteTask: (id: string) => void;
}

type SortOption = "priority" | "deadline" | "combined";

const Dashboard: React.FC<DashboardProps> = ({
    tasks,
    toggleCompletion,
    deleteTask
  }) => {
    const [sortOption, setSortOption] = useState<SortOption>("combined");

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortOption === "priority") {
          return (b.priority || 0) - (a.priority || 0);
        }
      
        if (sortOption === "deadline") {
          return DateToTime(a.deadline) - DateToTime(b.deadline);
        }
      
        if (sortOption === "combined") {
          const priorityA = a.priority || 0;
          const priorityB = b.priority || 0;
          const hoursUntilDeadlineA = DateToTime(a.deadline);
          const hoursUntilDeadlineB = DateToTime(b.deadline);
      
          // Hier kann die Gewichtung festgelegt werden
          const scoreA = hoursUntilDeadlineA * 0.6 - priorityA * 0.4;
          const scoreB = hoursUntilDeadlineB * 0.6 - priorityB * 0.4;
      
          return scoreA - scoreB;
        }
      
        return 0;
      });
      

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                <label>Sort by: </label>
                <select onChange={(e) => setSortOption(e.target.value as SortOption)} value={sortOption}>
                    <option value="priority">Priority</option>
                    <option value="deadline">Deadline</option>
                    <option value="combined">Combined</option>
                </select>
            </div>

            <ul className="task-list">
                {sortedTasks.map((task) => (
                <TaskItem
                    key={task.taskId}
                    task={task}
                    toggleCompletion={toggleCompletion}
                    deleteTask={deleteTask}
                />
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
