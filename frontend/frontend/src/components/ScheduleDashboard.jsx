import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../index.css";

export default function ScheduleDashboard() {
  const location = useLocation();

  // Check if we are on the main dashboard ("/schedule")
  const isDashboardHome = location.pathname === "/schedule";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <i className="bi bi-calendar-check"></i>
          <span>Schedule</span>
          
        </div>

        <nav className="menu">
          <Link
            to="/schedule"
            className={`menu-item ${isDashboardHome ? "active" : ""}`}
          >
            <i className="bi bi-grid"></i> Dashboard
          </Link>
          <Link
            to="/schedule/add"
            className={`menu-item ${
              location.pathname.includes("/schedule/add") ? "active" : ""
            }`}
          >
            <i className="bi bi-plus-circle"></i> Add Schedule
          </Link>
          <Link
            to="/schedule/view"
            className={`menu-item ${
              location.pathname.includes("/schedule/view") ? "active" : ""
            }`}
          >
            <i className="bi bi-eye"></i> All Schedules
          </Link>
          <Link
            to="/schedule/search"
            className={`menu-item ${
              location.pathname.includes("/schedule/search") ? "active" : ""
            }`}
          >
            <i className="bi bi-search"></i> Search
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {isDashboardHome ? (
          <>
            <header className="header">
              <div>
                <h2>Welcome back to Schedule! 👋</h2>
              </div>
              <Link to="/schedule/add">
                <button className="add-btn">
                  <i className="bi bi-plus-lg"></i> Add New Schedule
                </button>
              </Link>
            </header>

            {/* Cards section */}
            <div className="cards">
              <div className="card">
                <div className="card-header">
                  <h5>Total Schedules</h5>
                  <div className="icon blue">
                    <i className="bi bi-calendar-week"></i>
                  </div>
                </div>
                <p className="number">5</p>
                <p className="trend text-success">+12%</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5>Upcoming Events</h5>
                  <div className="icon orange">
                    <i className="bi bi-clock"></i>
                  </div>
                </div>
                <p className="number">4</p>
                <p className="trend text-success">+3 today</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5>Completed</h5>
                  <div className="icon green">
                    <i className="bi bi-check2-circle"></i>
                  </div>
                </div>
                <p className="number">1</p>
                <p className="trend text-success">+8 this week</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5>This Week</h5>
                  <div className="icon purple">
                    <i className="bi bi-graph-up"></i>
                  </div>
                </div>
                <p className="number">0</p>
                <p className="trend text-success">5 remaining</p>
              </div>
            </div>
          </>
        ) : (
          <Outlet /> // <-- renders AddSchedule, ViewSchedules, Search etc.
        )}
      </main>
    </div>
  );
}
