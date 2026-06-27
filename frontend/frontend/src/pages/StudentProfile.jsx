import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

export default function StudentProfile() {
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [formData, setFormData] = useState({
    stud_name: "",
    stud_email: "",
    password: "",
    dob: "",
    mobile: "",
  });
  const [searchId, setSearchId] = useState("");
  const [updateId, setUpdateId] = useState(null); // track if updating

  const API_BASE = "http://localhost:3000/student";

  // Fetch all students
  const fetchStudents = () => {
    setLoading(true);
    axios
      .get(API_BASE)
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch students");
        setLoading(false);
      });
  };

  // Fetch student by ID
  const fetchProfile = (id) => {
    setLoading(true);
    axios
      .get(`${API_BASE}/${id}`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch profile");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add new student
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE}/register`, formData)
      .then(() => {
        fetchStudents();
        setMessage("Student registered successfully!");
        setFormData({ stud_name: "", stud_email: "", password: "", dob: "", mobile: "" });
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => console.error(err));
  };

  // Update existing student
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!updateId) return;
    axios
      .put(`${API_BASE}/${updateId}`, formData)
      .then(() => {
        fetchStudents();
        setMessage("Student updated successfully!");
        setFormData({ stud_name: "", stud_email: "", password: "", dob: "", mobile: "" });
        setUpdateId(null);
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => console.error(err));
  };

  // Prepare form for updating a student
  const startUpdate = (student) => {
    setFormData({
      stud_name: student.stud_name,
      stud_email: student.stud_email,
      password: "", // leave empty
      dob: student.dob ? student.dob.split("T")[0] : "",
      mobile: student.mobile,
    });
    setUpdateId(student.sid);
  };

  // Delete student with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this student?")) {
      axios
        .delete(`${API_BASE}/${id}`)
        .then(() => {
          fetchStudents();
          setMessage("Student deleted successfully!");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => console.error(err));
    }
  };

  // Search by ID
  const handleSearch = () => {
    if (searchId) fetchProfile(searchId);
  };

  if (loading) return <p className="profile-container">Loading...</p>;
  if (error) return <p className="profile-container">{error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Student Management</h2>

      {message && <p className="success-message">{message}</p>} {/* Success message */}

      {/* Profile */}
      {profile.stud_name && (
        <div className="profile-card">
          <h3>Profile</h3>
          <p><strong>Name:</strong> {profile.stud_name}</p>
          <p><strong>Email:</strong> {profile.stud_email}</p>
          <p><strong>Date of Birth:</strong> {profile.dob || "N/A"}</p>
          <p><strong>Phone:</strong> {profile.mobile || "N/A"}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}

      {/* Search by ID */}
      <div className="profile-card">
        <h3>Search Student by ID</h3>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Add / Update Form */}
      <div className="profile-card">
        <h3>{updateId ? "Update Student" : "Register Student"}</h3>
        <form onSubmit={updateId ? handleUpdate : handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={formData.stud_name}
            onChange={(e) => setFormData({ ...formData, stud_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.stud_email}
            onChange={(e) => setFormData({ ...formData, stud_email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!updateId} // required only for registration
          />
          <input
            type="date"
            placeholder="DOB"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          <button type="submit">{updateId ? "Update" : "Register"}</button>
          {updateId && (
            <button
              type="button"
              onClick={() => {
                setFormData({ stud_name: "", stud_email: "", password: "", dob: "", mobile: "" });
                setUpdateId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* All Students */}
      <div className="profile-card">
        <h3>All Students</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.sid}>
                <td>{s.sid}</td>
                <td>{s.stud_name}</td>
                <td>{s.stud_email}</td>
                <td>{s.dob ? s.dob.split("T")[0] : "N/A"}</td>
                <td>{s.mobile || "N/A"}</td>
                <td>{s.role}</td>
                <td>
                  <button onClick={() => fetchProfile(s.sid)}>View</button>
                  <button onClick={() => startUpdate(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.sid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
