import React, { useEffect, useState } from "react";
import { get, post, put, del } from "../services/api";
import "../index.css";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    stud_name: "",
    stud_email: "",
    password: "",
    dob: "",
    mobile: "",
    role: "student",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // ✅ search state

  // ✅ Load all students
  useEffect(() => {
    loadStudents();
  }, []);

  function loadStudents() {
    setLoading(true);
    get("/student")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else if (Array.isArray(res.data.data)) {
          setStudents(res.data.data);
        } else {
          console.error("Unexpected response:", res);
          setStudents([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ✅ Add new student
  function handleAdd(e) {
    e.preventDefault();
    if (!form.password) {
      alert("Password is required");
      return;
    }

    post("/student", form)
      .then(() => {
        alert("Student added successfully");
        resetForm();
        loadStudents();
      })
      .catch(() => alert("Error adding student"));
  }

  // ✅ Update student
  function handleUpdate(e) {
    e.preventDefault();
    const updateData = { ...form };
    if (!updateData.password) {
      delete updateData.password;
    }

    put(`/student/${editingId}`, updateData)
      .then(() => {
        alert("Student updated successfully");
        resetForm();
        setEditingId(null);
        loadStudents();
      })
      .catch(() => alert("Error updating student"));
  }

  // ✅ Delete student
  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this account?")) {
      del(`/student/${id}`)
        .then(() => {
          alert("Account deleted");
          loadStudents();
        })
        .catch(() => alert("Error deleting student"));
    }
  }

  // ✅ Fill form with student data for editing
  function startEdit(student) {
    setForm({
      stud_name: student.stud_name,
      stud_email: student.stud_email,
      password: "",
      dob: student.dob?.split("T")[0],
      mobile: student.mobile,
      role: student.role,
    });
    setEditingId(student.sid);
  }

  function resetForm() {
    setForm({
      stud_name: "",
      stud_email: "",
      password: "",
      dob: "",
      mobile: "",
      role: "student",
    });
  }

  // ✅ Filter students by search
  const filteredStudents = students.filter((s) =>
    s.stud_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-page">
      <h2 className="student-heading">👩‍🎓 Manage Students</h2>

      {/* Form */}
      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="student-form"
      >
        <input
          type="text"
          name="stud_name"
          placeholder="Full Name"
          value={form.stud_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="stud_email"
          placeholder="Email"
          value={form.stud_email}
          onChange={handleChange}
          required
        />
        {!editingId && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
        />
        <button type="submit" className="btn-primary">
          {editingId ? "Update Student" : "Add Student"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingId(null);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </form>

      {/* ✅ Search Box */}
      <div className="student-search">
        <input
          type="text"
          placeholder="🔍 Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Student List */}
      <h3 className="student-subheading">📋 All Students</h3>
      {loading ? (
        <p className="loading">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="empty">No students found</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.sid}>
                <td>{s.stud_name}</td>
                <td>{s.stud_email}</td>
                <td>{s.dob?.split("T")[0]}</td>
                <td>{s.mobile}</td>
                <td>{s.role}</td>
                <td>
                  <button onClick={() => startEdit(s)} className="btn-edit">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.sid)}
                    className="btn-delete"
                  >
                    Delete
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
