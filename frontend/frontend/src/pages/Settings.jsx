import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); // ✅ stored at login

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ✅ Fetch admin profile
  useEffect(() => {
    if (!token) {
      setMessage("❌ Not logged in");
      return;
    }

    api.get("/setting/admin/profile")
      .then((res) => {
        setName(res.data.name || "");
        setEmail(res.data.email || "");
      })
      .catch(() => setMessage("❌ Error loading profile"));
  }, [token]);

  // ✅ Handle profile update
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Not logged in");
      return;
    }

    api.put("/setting/admin/update", {
      name,
      email,
      password,
    })
      .then((res) => {
        setMessage("✅ " + res.data.message);
        setPassword(""); // clear password after update
      })
      .catch(() => setMessage("❌ Error updating profile"));
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">⚙️ Settings</h2>

      <form className="settings-form" onSubmit={handleUpdate}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Change Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">💾 Save Changes</button>
      </form>

      {message && <p className="settings-message">{message}</p>}
    </div>
  );
}
