import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

export default function Results() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [studExams, setStudExams] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [marksObtained, setMarksObtained] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/student")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));

    api
      .get("/exam/view")
      .then((res) => setExams(res.data))
      .catch((err) => console.error("Error fetching exams:", err));

    api
      .get("/stud_exam/view")
      .then((res) => setStudExams(res.data))
      .catch((err) => console.error("Error fetching stud_exam records:", err));

    fetchResults();
  }, []);

  const fetchResults = () => {
    api
      .get("/result/view")
      .then((res) => setResults(res.data))
      .catch((err) => console.error("Error fetching results:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !examId || !marksObtained || !totalMarks) {
      return alert("All fields are required!");
    }

    try {
      const seRecord = studExams.find(
        (se) =>
          se.student_id === Number(studentId) && se.exam_id === Number(examId)
      );

      if (!seRecord) {
        return alert("This student is not assigned to this exam!");
      }

      const payload = {
        student_exam_id: seRecord.id,
        total_marks: Number(totalMarks),
        marks_obtained: Number(marksObtained),
      };

      await api.post("/result/add", payload);
      fetchResults();

      setStudentId("");
      setExamId("");
      setMarksObtained("");
      setTotalMarks("");

      alert("✅ Result saved successfully!");
    } catch (err) {
      console.error("❌ Error saving result:", err.response?.data || err.message);
      alert("Error saving result! Check console for details.");
    }
  };

  const filteredExams = studentId
    ? exams.filter((ex) =>
        studExams.some(
          (se) => se.student_id === Number(studentId) && se.exam_id === ex.id
        )
      )
    : [];

  return (
    <div className="results-container">
      <h2 className="results-title">📊 Manage Results</h2>

      {/* Form */}
      <form className="results-form" onSubmit={handleSubmit}>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.sid} value={s.sid}>
              {s.stud_name || s.name}
            </option>
          ))}
        </select>

        <select value={examId} onChange={(e) => setExamId(e.target.value)}>
          <option value="">Select Exam</option>
          {filteredExams.length > 0 ? (
            filteredExams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No exams assigned
            </option>
          )}
        </select>

        <input
          type="number"
          placeholder="Enter Total Marks"
          value={totalMarks}
          onChange={(e) => setTotalMarks(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Marks Obtained"
          value={marksObtained}
          onChange={(e) => setMarksObtained(e.target.value)}
        />

        <button type="submit">💾 Save Result</button>
      </form>

      {/* Search */}
      <div className="results-search">
        <input
          type="text"
          placeholder="🔍 Search result by student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <h3>📑 All Results</h3>
      <table className="results-table">
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
          {results.length > 0 ? (
            results
              .filter((r) =>
                r.student_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.student_name}</td>
                  <td>{r.exam_name}</td>
                  <td>{r.total_marks}</td>
                  <td>{r.marks_obtained}</td>
                  <td>{r.percentage}%</td>
                  <td
                    className={
                      r.status.toLowerCase() === "pass"
                        ? "results-status-pass"
                        : "results-status-fail"
                    }
                  >
                    {r.status}
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6">No Results Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
