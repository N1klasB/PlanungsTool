import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Task } from "../models/task";
import { Project } from "../models/project";
import { deleteTask, toggleTaskCompletion } from "../services/taskService.ts";
import { deleteProject } from "../services/projectService.ts";
import "../styles/index.ts";
import AddTask from "../components/AddTask.tsx";
import AddProject from "../components/AddProject.tsx";
import Dashboard from "../components/Dashboard.tsx";
import Callback from "../components/Callback.ts";
import LoginRedirect from "../components/Redirect.ts";
import TaskView from "../pages/TaskView.tsx";
import ProjectView from "../pages/ProjectView.tsx";
import { config } from "../config.ts";
import { getIdToken, getUsernameFromToken } from "../auth.ts";
import { Toaster, toast } from "sonner";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(getUsernameFromToken());

    const savedTasks = localStorage.getItem("loaded_tasks");
    const savedProjects = localStorage.getItem("loaded_projects");

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error("Invalid tasks in localStorage");
      }
    }

    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        if (Array.isArray(parsedProjects)) {
          setProjects(parsedProjects);
        }
      } catch (e) {
        console.error("Invalid projects in localStorage");
      }
    }
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
      toast("Not logged in.");
      return;
    }

    const payload = {
      tasks,
      projects,
    };

    const response = await fetch(config.APIURL + "/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    toast(data.message);
  };

  const loadFromBackend = async () => {
    const idToken = getIdToken();
    if (!idToken) {
      toast("Not logged in.");
      return;
    }

    const response = await fetch(config.APIURL + "/load", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();
    if (data.tasks) setTasks(data.tasks);
    if (data.projects) setProjects(data.projects);
    toast(data.message);
  };

  const handleLogout = async () => {
    const idToken = getIdToken();
    if (!idToken) {
      toast("Not logged in.");
      return;
    }

    const payload = { tasks, projects };

    try {
      const response = await fetch(config.APIURL + "/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Save failed:", errorText);
        toast("Failed to save data before logout.");
        return;
      }

      setTasks([]);
      setProjects([]);
      setUsername(null);
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("loaded_tasks");
      localStorage.removeItem("loaded_projects");

      toast("Logout successful.");
    } catch (error) {
      console.error("Logout error:", error);
      toast("Unexpected error during logout.");
    }
  };

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
              <a
                href={
                  "https://ni-beh-app-login.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=" +
                  config.USERPOOLCLIENTID +
                  "&redirect_uri=http://localhost:3000/callback"
                }
              >
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
              <button onClick={handleLogout}>Logout</button>
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
              <TaskView
                tasks={tasks}
                toggleCompletion={handleToggleTaskCompletion}
                deleteTask={handleDeleteTask}
              />
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
              <ProjectView
                projects={projects}
                deleteProject={handleDeleteProject}
              />
            }
          />
        </Routes>
      </div>
      <Toaster position="top-left" theme="light" />
    </Router>
  );
};

export default App;
