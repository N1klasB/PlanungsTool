import React from "react";
import { Link } from "react-router-dom";
import { config } from "../config.ts";

interface NavBarProps {
  username: string | null;
  saveToBackend: () => void;
  loadFromBackend: () => void;
  handleLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  username,
  saveToBackend,
  loadFromBackend,
  handleLogout,
}) => (
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
);

export default NavBar;
