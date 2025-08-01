import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Models
import { Task } from "../models/task";
import { Project } from "../models/project";

// Services
import { deleteTask, toggleTaskCompletion } from "../services/taskService.ts";
import { deleteProject } from "../services/projectService.ts";

// Styles
import "../styles/index.ts";

// Authentication & Config
import { config } from "../config.ts";
import { getIdToken, getUsernameFromToken } from "../auth.ts";

// Components - Utilities
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Toaster, toast } from "sonner";

// Components - Pages
import LoginRedirect from "../components/Redirect.ts";
import Callback from "../components/Callback.ts";
import NavBar from "../components/NavBar.tsx";
import Dashboard from "../components/Dashboard.tsx";
import AddTask from "../components/AddTask.tsx";
import AddProject from "../components/AddProject.tsx";
import ProjectView from "../components/ProjectView.tsx";

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

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.taskId === updatedTask.taskId ? updatedTask : t))
    );
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

  const updateTaskBackend = async (
    partialTask: Partial<Task> & { taskId: string }
  ) => {
    const idToken = getIdToken();
    if (!idToken) {
      toast("Not logged in.");
      return;
    }

    const response = await fetch(config.APIURL + "/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ tasks: [partialTask] }),
    });

    const data = await response.json();
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
        <NavBar
          username={username}
          saveToBackend={saveToBackend}
          loadFromBackend={loadFromBackend}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/callback" element={<Callback />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/Dashboard"
              element={
                <Dashboard
                  tasks={tasks}
                  projects={projects}
                  toggleCompletion={handleToggleTaskCompletion}
                  deleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                  updateTaskBackend={updateTaskBackend}
                />
              }
            />
            <Route
              path="/add-task"
              element={
                <AddTask
                  tasks={tasks}
                  setTasks={setTasks}
                  projects={projects}
                />
              }
            />
            <Route
              path="/add-project"
              element={
                <AddProject projects={projects} setProjects={setProjects} />
              }
            />
          </Route>
        </Routes>
      </div>
      <Toaster position="top-left" theme="light" />
    </Router>
  );
};

export default App;
