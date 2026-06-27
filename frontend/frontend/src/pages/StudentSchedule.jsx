// src/pages/StudentSchedule.jsx
import React, { useEffect, useState } from "react";
import { get } from "../services/api"; // your axios wrapper

export default function StudentSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/api/exam/view") // ✅ hit admin’s exam view API
      .then((res) => {
        setSchedules(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch schedule");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Exam Schedule</h2>
      {schedules.length === 0 ? (
        <p>No schedules available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Exam Title</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((exam) => (
              <tr key={exam.id}>
                <td className="border p-2">{exam.title}</td>
                <td className="border p-2">{exam.date}</td>
                <td className="border p-2">{exam.start_time}</td>
                <td className="border p-2">{exam.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
