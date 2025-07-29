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
import { Project } from "../models/project.ts";

interface DashboardProps {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  projects: Project[];
  onUpdateTask: (task: Task) => void;
  updateTaskBackend: (partialTask: Partial<Task> & { taskId: string }) => void;
}

type SortOption = "priority" | "deadline" | "combined";
type FilterOption = "all" | "open" | "completed";

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  projects,
  toggleCompletion,
  deleteTask,
  onUpdateTask,
  updateTaskBackend,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>("combined");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterOption === "completed") return task.taskStatus && matchesSearch;
    if (filterOption === "open") return !task.taskStatus && matchesSearch;
    return matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "priority") {
      return (b.priority || 0) - (a.priority || 0);
    }

    if (sortOption === "deadline") {
      return a.deadline && b.deadline
        ? DateToTime(a.deadline) - DateToTime(b.deadline)
        : a.deadline
        ? -1
        : b.deadline
        ? 1
        : 0;
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
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>

      <div className="dashboard-top">
        <div className="dashboard-box kpi-box">
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
        </div>
        <div className="dashboard-box progress-box">
          <label>Progress:</label>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <small>{completionRate}% completion</small>
        </div>
        <div className="dashboard-box pie-box">
          <ResponsiveContainer width="100%" height={300}>
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
      <div className="dashboard-box search-box">
        <label htmlFor="search">Search Tasks:</label>
        <input
          type="text"
          id="search"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="dashboard-box filter-box">
        <div className="dropdown-container">
          <label className="dropdown-label">Filter:</label>
          <select
            className="dropdown-select"
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            value={sortOption}
          >
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="combined">Combined</option>
          </select>
        </div>
        <div className="dropdown-container">
          <label className="dropdown-label">Filter:</label>
          <select
            className="dropdown-select"
            onChange={(e) => setFilterOption(e.target.value as FilterOption)}
            value={filterOption}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="task-projects-row">
        <ul className="task-list">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskItem
                key={task.taskId}
                task={task}
                toggleCompletion={toggleCompletion}
                deleteTask={deleteTask}
                projects={projects}
                onUpdateTask={onUpdateTask}
                updateTaskBackend={updateTaskBackend}
              />
            ))
          ) : (
            <p>No Tasks Found.</p>
          )}
        </ul>
        <div className="project-box">
          <h3>Projects</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
