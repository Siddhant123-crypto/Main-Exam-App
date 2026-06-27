import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

export default function Exam() {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    duration: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/exam/view", { headers });
      setExams(res.data);
    } catch (err) {
      console.error("Error fetching exams:", JSON.stringify(err.response?.data, null, 2) || err.message);
      alert("❌ Failed to fetch exams");
    }
  };

  const validateExam = (exam) => {
    if (!exam.title.trim()) return "Title is required";
    if (!exam.date.trim()) return "Date is required";
    if (!exam.start_time.trim()) return "Start Time is required";
    return null;
  };

  const saveExam = async () => {
    const validationError = validateExam(newExam);
    if (validationError) {
      return alert(`❌ ${validationError}`);
    }

    try {
      // Format date as YYYY-MM-DD for MySQL
      const formattedDate = new Date(newExam.date).toISOString().split("T")[0];

      const examData = {
        title: newExam.title,
        description: newExam.description,
        date: formattedDate,
        start_time: newExam.start_time,
        end_time: newExam.end_time,
        duration: newExam.duration,
        created_by: 1 // Hardcoded for now
      };

      if (newExam.id) {
        // Update exam
        await axios.put(`http://localhost:3000/api/exam/update/${newExam.id}`, examData, { headers });
        alert("✅ Exam updated successfully");
      } else {
        // Add exam
        await axios.post("http://localhost:3000/api/exam/add", examData, { headers });
        alert("🎉 Exam added successfully");
      }

      // Refresh exams and reset form
      fetchExams();
      setNewExam({
        id: null,
        title: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        duration: ""
      });
    } catch (err) {
      console.error("Error saving exam:", JSON.stringify(err.response?.data, null, 2) || err.message);
      alert(`❌ Failed to save exam: ${err.response?.data?.error || err.message}`);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/exam/delete/${id}`, {
        headers,
        data: {}
      });
      fetchExams();
      alert("🗑️ Exam deleted successfully");
    } catch (err) {
      console.error("Error deleting exam:", JSON.stringify(err.response?.data, null, 2) || err.message);
      alert(`❌ Failed to delete exam: ${err.response?.data?.error || err.message}`);
    }
  };

  const editExam = (exam) => {
    setNewExam({
      id: exam.id || null,
      title: exam.title || "",
      description: exam.description || "",
      date: exam.date ? exam.date.split("T")[0] : "", // Ensure correct YYYY-MM-DD format
      start_time: exam.start_time || "",
      end_time: exam.end_time || "",
      duration: exam.duration || ""
    });
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.date && exam.date.includes(searchTerm))
  );

  return (
    <section className="exam-container">
      <h2>📚 Manage Exams</h2>

      {/* Form */}
      <div className="exam-form">
        <input
          type="text"
          placeholder="Title *"
          value={newExam.title}
          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newExam.description}
          onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
        />
        <input
          type="date"
          value={newExam.date}
          onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
        />
        <input
          type="time"
          value={newExam.start_time}
          onChange={(e) => setNewExam({ ...newExam, start_time: e.target.value })}
        />
        <input
          type="time"
          value={newExam.end_time}
          onChange={(e) => setNewExam({ ...newExam, end_time: e.target.value })}
        />
        <input
          type="text"
          placeholder="Duration (e.g., 2h)"
          value={newExam.duration}
          onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
        />
        <button onClick={saveExam} className="btn btn-primary">
          {newExam.id ? "Update Exam" : "Add Exam"}
        </button>
      </div>

      {/* Search */}
      <div className="exam-search">
        <input
          type="text"
          placeholder="🔍 Search exam by title or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <h3>📋 All Exams</h3>
      <table className="exam-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.description}</td>
                <td>{exam.date}</td>
                <td>{exam.start_time}</td>
                <td>{exam.end_time}</td>
                <td>{exam.duration}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => editExam(exam)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => deleteExam(exam.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No exams found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
