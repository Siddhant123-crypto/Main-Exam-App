// src/pages/MyExam.jsx
import React, { useEffect, useState } from "react";
import { getExamStats, getExams } from "../services/api";
import { Link } from "react-router-dom";
import "../index.css";

export default function MyExam() {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, active: 0, completed: 0 });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getExamStats(), getExams()])
      .then(([statsRes, examsRes]) => {
        setStats({
          total: Number(statsRes.data.total || 0),
          upcoming: Number(statsRes.data.upcoming || 0),
          active: Number(statsRes.data.active || 0),
          completed: Number(statsRes.data.completed || 0),
        });

        setExams(examsRes.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch exam data:", err);
        setError(err.response?.data?.message || "Error fetching data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading exams...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Exam Stats</h1>
      <p>Total Exams: {stats.total}</p>
      <p>Upcoming Exams: {stats.upcoming}</p>
      <p>Active Exams: {stats.active}</p>
      <p>Completed Exams: {stats.completed}</p>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Available Exams</h2>
      {exams.length === 0 ? (
        <p>No exams available.</p>
      ) : (
        <ul className="space-y-3">
          {exams.map(exam => {
            // Safely format date
            const examDate = exam.date ? new Date(exam.date).toLocaleDateString() : "Date not set";

            return (
              <li key={exam.id} className="flex items-center justify-between border p-2 rounded">
                <span>
                  <strong>{exam.title}</strong> — {examDate}
                </span>
                <Link to={`/student-dashboard/exam/${exam.id}/submit`}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Take Exam
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
