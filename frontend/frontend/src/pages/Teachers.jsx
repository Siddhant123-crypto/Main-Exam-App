import React, { useState } from "react";
import "../index.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([
    { name: "tushar sir", email: "tushar@example.com", dob: "1985-09-10", mobile: "9876543211", role: "teacher" },
    { name: "karan sharma", email: "karan@gmail.com", dob: "1986-01-22", mobile: "1234567891", role: "teacher" },
    { name: "ravi kumar", email: "ravi@gmail.com", dob: "1990-05-11", mobile: "9998887776", role: "teacher" },
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: "", email: "", dob: "", mobile: "", role: "teacher"
  });

  const [searchTerm, setSearchTerm] = useState(""); // 🔍 for search

  const handleChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const addTeacher = () => {
    if (!newTeacher.name || !newTeacher.email) return;
    setTeachers([...teachers, newTeacher]);
    setNewTeacher({ name: "", email: "", dob: "", mobile: "", role: "teacher" });
  };

  const deleteTeacher = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (confirmDelete) {
      const updated = [...teachers];
      updated.splice(index, 1);
      setTeachers(updated);
    }
  };

  const editTeacher = (index) => {
    const confirmedit = window.confirm("Are you sure you want to edit this teacher?");
    setNewTeacher(teachers[index]);
    deleteTeacher(index);
  };

  // 🔎 Filter teachers by name
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="teachers-container">
      <h2>👩‍🏫 Manage Teachers</h2>
      
      {/* Form */}
      <div className="teacher-form">
        <input type="text" name="name" placeholder="Full Name" value={newTeacher.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={newTeacher.email} onChange={handleChange} />
        <input type="date" name="dob" value={newTeacher.dob} onChange={handleChange} />
        <input type="text" name="mobile" placeholder="Mobile" value={newTeacher.mobile} onChange={handleChange} />
        <input type="text" name="role" value="teacher" disabled />
        <button onClick={addTeacher} className="btn btn-primary">Add Teacher</button>
      </div>

      {/* Search */}
      <div className="teacher-search">
        <input
          type="text"
          placeholder="🔍 Search teacher by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // update search
        />
      </div>

      {/* Table */}
      <h3>📋 All Teachers</h3>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>DOB</th><th>Mobile</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((t, index) => (
              <tr key={index}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.dob}</td>
                <td>{t.mobile}</td>
                <td>{t.role}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => editTeacher(index)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => deleteTeacher(index)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No teachers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
