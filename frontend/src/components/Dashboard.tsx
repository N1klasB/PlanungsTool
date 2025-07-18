import React, { useState } from "react";
import { Task } from "../models/task";
import TaskItem from "./TaskItem.tsx";
import { DateToTime } from "../services/dateToTime.ts";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardProps {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

type SortOption = "priority" | "deadline" | "combined";
type FilterOption = "all" | "open" | "completed";

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  toggleCompletion,
  deleteTask,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>("combined");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");

  const now = new Date().getTime();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.taskStatus).length;
  const pendingTasks = tasks.filter((t) => !t.taskStatus).length;
  const overdueTasks = tasks.filter(
    (t) => !t.taskStatus && new Date(t.deadline).getTime() < now
  ).length;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filterOption === "completed") return task.taskStatus;
    if (filterOption === "open") return !task.taskStatus;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
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

      const scoreA = hoursUntilDeadlineA * 0.6 - priorityA * 0.4;
      const scoreB = hoursUntilDeadlineB * 0.6 - priorityB * 0.4;

      return scoreA - scoreB;
    }

    return 0;
  });

  const pieData = [
    { name: "Completed", value: completedTasks },
    { name: "Open", value: pendingTasks },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div>
      <h2>Dashboard</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div className="dashboard-kpis">
          <p>
            <strong>Number of Tasks:</strong> {totalTasks}
          </p>
          <p>
            <strong>Completed:</strong> {completedTasks}
          </p>
          <p>
            <strong>Open:</strong> {pendingTasks}
          </p>
          <p>
            <strong>Overdue:</strong> {overdueTasks}
          </p>
          <p>
            <strong>Completion rate:</strong> {completionRate}%
          </p>
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div className="dropdown-container">
          <label className="dropdown-label">Sortieren nach:</label>
          <select
            className="dropdown-select"
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            value={sortOption}
          >
            <option value="priority">Priorität</option>
            <option value="deadline">Deadline</option>
            <option value="combined">Kombiniert</option>
          </select>
        </div>
        <div className="dropdown-container">
          <label className="dropdown-label">Filter:</label>
          <select
            className="dropdown-select"
            onChange={(e) => setFilterOption(e.target.value as FilterOption)}
            value={filterOption}
          >
            <option value="all">Alle</option>
            <option value="open">Offen</option>
            <option value="completed">Erledigt</option>
          </select>
        </div>
      </div>

      <ul className="task-list">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.taskId}
              task={task}
              toggleCompletion={toggleCompletion}
              deleteTask={deleteTask}
            />
          ))
        ) : (
          <p>No Tasks Found.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
