import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Task } from "../models/task";
import { Project } from "../models/project";
import { deleteTask, toggleTaskCompletion } from "../services/taskService.ts";
import { deleteProject } from "../services/projectService.ts";
import "../styles/index.ts";
import TaskItem from "../components/TaskItem.tsx";
import AddTask from "../components/AddTask.tsx";
import AddProject from "../components/AddProject.tsx";
import ProjectItem from "../components/ProjectItem.tsx";
import Dashboard from "../components/Dashboard.tsx";
import { generateId } from "../services/idGenerator.ts";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessionId, setSessionId] = useState<string>(generateId());
  const [customSessionId, setCustomSessionId] = useState<string>("");

  const handleDeleteTask = (id: string) => {
    setTasks(deleteTask(tasks, id));
  };

  const handleToggleTaskCompletion = (id: string) => {
    setTasks(toggleTaskCompletion(tasks, id));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(deleteProject(projects, id));
  };

  const saveToBackend = async () => {
    const payload = {
      sessionId: sessionId,
      tasks,
      projects,
    };

    const response = await fetch(
      "https://vvg2f72ym9.execute-api.eu-central-1.amazonaws.com/prod/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "nx32kkfsrdx92hajd83lqw",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    alert(data.message);
  };

  const loadFromBackend = async () => {
    const response = await fetch(
      "https://vvg2f72ym9.execute-api.eu-central-1.amazonaws.com/prod/load?sessionId=" +
        sessionId,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": "nx32kkfsrdx92hajd83lqw",
        },
      }
    );

    const data = await response.json();
    if (data.tasks) setTasks(data.tasks);
    if (data.projects) setProjects(data.projects);
    alert(data.message);
  };

  const handleSessionId = () => {
    if (customSessionId.trim()) {
      setSessionId(customSessionId.trim());
      setCustomSessionId("");
      setTasks([]);
      setProjects([]);
    }
  };

  const completedTasks = tasks.filter((task) => task.taskStatus);
  const pendingTasks: Task[] = tasks.filter((task) => !task.taskStatus);

  return (
    <Router>
      <div className="app">
        <nav className="nav-bar">
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "1rem",
              padding: 0,
              alignItems: "center",
            }}
          >
            <li>
              <h1>Planning Assistant</h1>
            </li>
            <li>
              <Link to="/Menu">Menu</Link>
            </li>
            <li>
              <Link to="/Dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/add-task">Create new Task</Link>
            </li>
            <li>
              <Link to="/add-project">Create new Project</Link>
            </li>
            <li>
              <Link to="/tasks">Task-Overview</Link>
            </li>
            <li>
              <Link to="/projects">Project-Overview</Link>
            </li>

            <li
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                placeholder="Session ID setzen"
                value={customSessionId}
                onChange={(e) => setCustomSessionId(e.target.value)}
              />
              <button onClick={handleSessionId}>Set</button>
              <button onClick={saveToBackend}>Save</button>
              <button onClick={loadFromBackend}>Load</button>
              {sessionId}
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/Menu" />} />
          <Route
            path="/Menu"
            element={
              <div className="menu-heading">
                <h1>Planning Assistant</h1>
                <nav className="menu-buttons">
                  <li>
                    <Link to="/Dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/add-task">Create new Task</Link>
                  </li>
                  <li>
                    <Link to="/add-project">Create new Project</Link>
                  </li>
                  <li>
                    <Link to="/tasks">Task-Overview</Link>
                  </li>
                  <li>
                    <Link to="/projects">Project-Overview</Link>
                  </li>
                </nav>
              </div>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <Dashboard
                tasks={tasks}
                projects={projects}
                toggleCompletion={handleToggleTaskCompletion}
                deleteTask={handleDeleteTask}
              />
            }
          />
          <Route
            path="/add-task"
            element={
              <AddTask tasks={tasks} setTasks={setTasks} projects={projects} />
            }
          />
          <Route
            path="/tasks"
            element={
              <div>
                <div className="pendingTasks">
                  <h2>Pending Tasks</h2>
                </div>
                <ul className="task-list">
                  {pendingTasks.map((task) => (
                    <TaskItem
                      key={task.taskId}
                      task={task}
                      toggleCompletion={handleToggleTaskCompletion}
                      deleteTask={handleDeleteTask}
                    />
                  ))}
                </ul>
                <div className="completedTasks">
                  <h2>Completed Tasks</h2>
                </div>
                <ul className="task-list completed">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.taskId}
                      task={task}
                      toggleCompletion={handleToggleTaskCompletion}
                      deleteTask={handleDeleteTask}
                    />
                  ))}
                </ul>
              </div>
            }
          />
          <Route
            path="/add-project"
            element={
              <AddProject projects={projects} setProjects={setProjects} />
            }
          />
          <Route
            path="/projects"
            element={
              <div>
                <h2>Projects</h2>
                <div className="project-list">
                  {projects.map((project) => (
                    <ProjectItem
                      key={project.projectId}
                      project={project}
                      deleteProject={handleDeleteProject}
                      tasks={tasks}
                    />
                  ))}
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
