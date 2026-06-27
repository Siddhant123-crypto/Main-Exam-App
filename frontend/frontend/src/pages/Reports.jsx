import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [reports, setReports] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    // ✅ fetch students
    axios
      .get("http://localhost:3000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));

    // ✅ fetch exams
    api
      .get("/exam/view")
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error fetching exams:", err));
  }, []);

  const fetchReport = () => {
    if (!studentId) {
      alert("Please select a student");
      return;
    }

    let url = `/report/student/${studentId}`;
    if (examId) {
      url = `/report/student/${studentId}/exam/${examId}`;
    }

    api
      .get(url)
      .then((res) => setReports(res.data))
      .catch((err) => console.error("Error fetching report:", err));
  };

  return (
    <div className="report-container">
      <h2 className="report-title">📊 Student Report</h2>

      {/* Filters */}
      <div className="report-form">
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.sid} value={s.sid}>
              {s.stud_name}
            </option>
          ))}
        </select>

        <select value={examId} onChange={(e) => setExamId(e.target.value)}>
          <option value="">All Exams</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>

        <button onClick={fetchReport}>📑 Generate Report</button>
      </div>

      {/* Report Table */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Exam</th>
            <th>Total Marks</th>
            <th>Obtained</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((r) => (
              <tr key={r.id}>
                <td>{r.student_name}</td>
                <td>{r.exam_name}</td>
                <td>{r.total_marks}</td>
                <td>{r.marks_obtained}</td>
                <td>{r.percentage}%</td>
                <td style={{ color: r.status === "pass" ? "green" : "red" }}>
                  {r.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No report data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
