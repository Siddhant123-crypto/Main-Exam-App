import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/register
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // 🔑 ADMIN LOGIN API
      axios
        .post("http://localhost:3000/admin/login", { email, password })
        .then((res) => {
          // ✅ Save token & admin data
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          alert("Login successful!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Login failed:", err);
          alert(err.response?.data?.message || "Invalid email or password");
        });
    } else {
      // 📝 ADMIN REGISTER API
      axios
        .post("http://localhost:3000/admin/register", {
          name: fullName,
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("admin", JSON.stringify(res.data.admin));

          alert("Registration successful!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("Registration failed:", err);
          alert(err.response?.data?.message || "Error while registering");
        });
    }
  };

  return (
    <section id="auth" className="auth">
      <div className="auth-container">
        <h2>{isLogin ? "Admin Login" : "Admin Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p>
          {isLogin
            ? "Don't have an admin account? "
            : "Already have an admin account? "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </section>
  );
}
