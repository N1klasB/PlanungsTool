import React from "react";
import { Link } from "react-router-dom";

const Menu = () => (
  <div className="menu-heading">
    <h1>Planning Assistant</h1>
    <nav className="menu-buttons">
      <li><Link to="/Dashboard">Dashboard</Link></li>
      <li><Link to="/add-task">Create new Task</Link></li>
      <li><Link to="/add-project">Create new Project</Link></li>
      <li><Link to="/tasks">Task-Overview</Link></li>
      <li><Link to="/projects">Project-Overview</Link></li>
    </nav>
  </div>
);

export default Menu;    