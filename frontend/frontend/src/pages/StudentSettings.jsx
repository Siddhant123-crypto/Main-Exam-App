// src/pages/StudentSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

export default function StudentSettings() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    stud_name: "",
    stud_email: "",
    password: "",
    dob: "",
    mobile: "",
  });

  const studentId = localStorage.getItem("studentId"); // ✅ check if logged in
  const API_BASE = "http://localhost:3000/student";

  useEffect(() => {
    if (!studentId) {
      setMessage("⚠️ You are not logged in.");
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE}/${studentId}`)
      .then((res) => {
        setProfile(res.data);
        setFormData({
          stud_name: res.data.stud_name,
          stud_email: res.data.stud_email,
          password: "",
          dob: res.data.dob ? res.data.dob.split("T")[0] : "",
          mobile: res.data.mobile || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to fetch profile.");
        setLoading(false);
      });
  }, [studentId]);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!studentId) {
      setMessage("⚠️ You are not logged in.");
      return;
    }

    const payload = { ...formData };
    if (!payload.password) delete payload.password; // don’t overwrite password if empty

    axios.put(`${API_BASE}/${studentId}`, payload)
      .then((res) => {
        setMessage(res.data.message || "✅ Profile updated successfully!");
        setProfile({ ...profile, ...payload, password: "" });
        setFormData({ ...formData, password: "" });
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data?.message || "❌ Error updating profile.");
      });
  };

  if (loading) return <p className="profile-container">Loading...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Student Settings</h2>

      {message && <p className="profile-message">{message}</p>}

      {!studentId ? (
        <p>Please login to access your profile settings.</p>
      ) : (
        <form onSubmit={handleUpdate} className="profile-form">
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
            placeholder="Password (leave blank to keep current)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          <button type="submit" className="btn-update">
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
}
