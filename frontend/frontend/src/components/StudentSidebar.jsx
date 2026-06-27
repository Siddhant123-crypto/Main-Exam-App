// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const links = [
    { path: "/student-dashboard", label: "Dashboard" },
    { path: "/student-dashboard/my-exam", label: "My Exam" },
    { path: "/student-dashboard/schedule", label: "Schedule" }, // ✅ Schedule link
    { path: "/student-dashboard/profile", label: "Profile" },
    { path: "/student-dashboard/settings", label: "Settings" },
  ];

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token/session
    navigate("/login"); // redirect to login page
  };

  // Internal styles for the logo
  const logoStyle = {
    fontSize: "70px", // bigger logo
    textAlign: "center",
    marginBottom: "10px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "1.2",
    marginBottom: "40px",
  };

  return (
    <aside className="sidebar">
      <div className="logo" style={logoStyle}>🎓</div>
      <h1 className="title" style={titleStyle}>Student Portal</h1>

      <nav className="menu">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <span className="icon">{link.icon}</span>
            <span className="label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ✅ Logout button at bottom */}
      
    </aside>
  );
}
