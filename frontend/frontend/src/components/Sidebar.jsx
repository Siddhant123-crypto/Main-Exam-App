import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa"; // graduation cap icon
import "../index.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <FaGraduationCap className="logo-icon" />
        <div className="logo-text">
          ExamApp <span>Portal</span>
        </div>
      </div>

      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/students">Student</Link></li>
          <li><Link to="/Exam">Exam</Link></li>
           <li><Link to="/teachers">Teachers</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
