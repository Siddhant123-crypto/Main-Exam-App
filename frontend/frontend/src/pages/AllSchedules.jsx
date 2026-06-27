import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../index.css";

export default function AllSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // ✅ YYYY-MM-DD only
  };

  // Fetch schedules on mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ get token from localStorage

    axios
      .get("http://localhost:3000/schedule/view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSchedules(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load schedules");
        setLoading(false);
      });
  }, []);

  // Delete schedule
  const deleteSchedule = (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    const token = localStorage.getItem("token");

    axios
      .delete(`http://localhost:3000/schedule/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setSchedules(schedules.filter((s) => s.id !== id));
      })
      .catch(() => {
        alert("Failed to delete schedule");
      });
  };

  if (loading) return <p className="loading">Loading schedules...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="schedule-container">
      <h2 className="page-title">📅 All Schedules</h2>

      {schedules.length === 0 ? (
        <p>No schedules found.</p>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Exam Date</th>
              <th>Start Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.title}</td>
                <td>{formatDate(schedule.exam_date)}</td>
                <td>{schedule.start_time}</td>
                <td>
                  <Link
                    to={`/schedule/update/${schedule.id}`}
                    className="btn edit"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="btn delete"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
