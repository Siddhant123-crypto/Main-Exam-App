// src/components/StudentAuth.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function StudentAuth() {
  const [formData, setFormData] = useState({ stud_email: "", password: "", stud_name: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const API_BASE = "http://localhost:3000/student";

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (isRegister) {
      // Registration
      axios.post(`${API_BASE}/register`, formData)
        .then((res) => {
          setMessage(res.data.message || "Registration successful! Please login.");
          setIsRegister(false);
          setFormData({ stud_email: "", password: "", stud_name: "" });
        })
        .catch((err) => {
          const errMsg = err.response?.data?.message || "Registration failed!";
          setMessage(`❌ ${errMsg}`);
          setFormData({ ...formData, password: "" });
        });
    } else {
      // Login
      axios.post(`${API_BASE}/login`, formData)
        .then((res) => {
          const { token, sid } = res.data; // store JWT and student ID
          localStorage.setItem("token", token);
          localStorage.setItem("studentId", sid);

          setMessage("✅ Login successful! Redirecting...");
          setFormData({ stud_email: "", password: "" });

          setTimeout(() => navigate("/student-dashboard"), 1200);
        })
        .catch((err) => {
          const errMsg = err.response?.data?.message || "Login failed! Check credentials.";
          setMessage(`❌ ${errMsg}`);
          setFormData({ ...formData, password: "" });
        });
    }
  };

  return (
    <div className="student-auth">
      <h2>{isRegister ? "Register" : "Student Login"}</h2>

      {message && (
        <p className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={formData.stud_name}
            onChange={(e) => setFormData({ ...formData, stud_name: e.target.value })}
            required
          />
        )}
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
          required
        />
        <button type="submit" className="btn-submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p className="toggle-auth">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
            setFormData({ stud_email: "", password: "", stud_name: "" });
          }}
          className="toggle-btn"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
