// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { get } from "../services/api";
import Sidebar from "../components/StudentSidebar";
import "../index.css";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    active: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardPage =
    location.pathname === "/student-dashboard" ||
    location.pathname === "/student-dashboard/";

  const handleLogout = () => {
    // Clear any student authentication tokens or data
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    
    // Navigate to home page
    navigate("/");
  };

  useEffect(() => {
    get("/api/exam/stats")
      .then((res) => {
        setStats({
          total: Number(res.data.total),
          upcoming: Number(res.data.upcoming),
          active: Number(res.data.active),
          completed: Number(res.data.completed),
        });
      })
      .catch(() => {
        // fallback values if API fails
        setStats({ total: 5, upcoming: 2, active: 1, completed: 2 });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="student-dashboard">
      {/* ✅ Reusable Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="main-content">
        <Outlet />

        {isDashboardPage && (
          <>
            <header className="dashboard-header">
              <div>
                <h2>Hello Student</h2>
                <p>Track your exams and progress</p>
              </div>
              
              <div className="header-buttons">
                <button 
                  className="schedule-btn" 
                  onClick={() => navigate("/student-dashboard/my-exam")}
                >
                  📅 Join Exam
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </header>

            {loading ? (
              <p>Loading exam stats...</p>
            ) : (
              <div className="stats-grid">
                <div className="card total">
                  <h3>Total Exam</h3>
                  <p>{stats.total}</p>
                </div>
                <div className="card upcoming">
                  <h3>Upcoming Exams</h3>
                  <p>{stats.upcoming}</p>
                </div>
                <div className="card active">
                  <h3>Active Exams</h3>
                  <p>{stats.active}</p>
                </div>
                <div className="card completed">
                  <h3>Completed</h3>
                  <p>{stats.completed}</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}