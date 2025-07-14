import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
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
import Callback from "../components/Callback.ts";
import LoginRedirect from "../components/Redirect.ts";

const getUsernameFromToken = (): string | null => {
  const token = localStorage.getItem("id_token") || "";
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload["cognito:username"] || null;
  } catch {
    return null;
  }
};

const getIdToken = (): string | null => {
  return localStorage.getItem("id_token") || null;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsernameFromToken());
  }, []);

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
    const idToken = getIdToken();
    if (!idToken) {
      alert("Not logged in.");
      return;
    }

    const payload = {
      tasks,
      projects,
    };

    const response = await fetch(
      "https://vvg2f72ym9.execute-api.eu-central-1.amazonaws.com/prod/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    alert(data.message);
  };

  const loadFromBackend = async () => {
    const idToken = getIdToken();
    if (!idToken) {
      alert("Not logged in.");
      return;
    }

    const response = await fetch(
      "https://vvg2f72ym9.execute-api.eu-central-1.amazonaws.com/prod/load",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.tasks) setTasks(data.tasks);
    if (data.projects) setProjects(data.projects);
    alert(data.message);
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
              <a href="https://ni-beh-app-login.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=49fmlkpn2urofbnebokhvvmb02&redirect_uri=http://localhost:3000/callback">
                Login
              </a>
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
              {username ? `Logged in as: ${username}` : "Not logged in"}
              <button onClick={saveToBackend}>Save</button>
              <button onClick={loadFromBackend}>Load</button>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<LoginRedirect />} />
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
