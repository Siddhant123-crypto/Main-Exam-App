import React, { useState } from "react";
import axios from "axios";
import "../index.css";

export default function SearchSchedule() {
  const [examDate, setExamDate] = useState(""); // YYYY-MM-DD
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setResults([]);
    
    if (!examDate) {
      setMessage("Please select a date to search.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Convert examDate to YYYY-MM-DD just in case
      const formattedDate = new Date(examDate).toISOString().split("T")[0];

      const res = await axios.get(
        `http://localhost:3000/schedule/search?exam_date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.length === 0) {
        setMessage("No schedules found for this date.");
      } else {
        // Format all exam_date fields in results
        const formattedResults = res.data.map((r) => ({
          ...r,
          exam_date: r.exam_date ? new Date(r.exam_date).toISOString().split("T")[0] : "",
        }));
        setResults(formattedResults);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to search schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-container">
      <h2 className="page-title">🔍 Search Schedules by Date</h2>

      <form onSubmit={handleSearch} className="form-container">
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {message && <p className="error">{message}</p>}

      {results.length > 0 && (
        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Exam Date</th>
              <th>Start Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.title}</td>
                <td>{schedule.exam_date}</td>
                <td>{schedule.start_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
