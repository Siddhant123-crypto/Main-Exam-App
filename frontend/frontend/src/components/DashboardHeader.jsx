// src/components/DashboardHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../index.css";

function DashboardHeader({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/"); // go back to home
  };

  return (
    <header className="dashboard-header">
      <div>
        <h2>Welcome back, {username}</h2>
        <p>Manage your exam platform and monitor system performance</p>
      </div>
      <div className="header-buttons">
        {/* New Exam Question Button */}
        <button 
          className="exam-question-btn" 
          onClick={() => navigate("/admin/questions")}
        >
          📝 Exam Question
        </button>

        {/* Existing Buttons */}
        <button 
          className="schedule-btn" 
          onClick={() => navigate("/schedule")}
        >
          📅 Schedule
        </button>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
