// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatsCard from "../components/StatsCard";
import ChartComponent from "../components/Chart";   

import "../index.css";

function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to Home
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* ✅ Pass logout button to header */}
        <DashboardHeader onLogout={handleLogout} />

        {/* Stats Cards Section */}
        <div className="stats-grid">
          <StatsCard title="Total Users" value="1" color="blue" />
          <StatsCard title="Total Exams" value="3" color="purple" />
          <StatsCard title="Total Attempts" value="0" color="orange" />
          <StatsCard title="Active Exams" value="0" color="green" />
        </div>

        {/* Chart */}
        <ChartComponent />
      </div>
    </div>
  );
}

export default Dashboard;
