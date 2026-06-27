import React from "react";
import { useNavigate } from "react-router-dom"; // for Login/Register navigation
import "../index.css";

export default function Header() {
  const navigate = useNavigate();

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="header">
      <div className="logo">ExamApp</div>

      {/* Navigation Links */}
      <nav>
        <ul className="nav-links">
          <li><span onClick={() => scrollToSection("home")}>Home</span></li>
          <li><span onClick={() => scrollToSection("features")}>Features</span></li>
          <li><span onClick={() => scrollToSection("about")}>About</span></li>
          <li><span onClick={() => scrollToSection("footer")}>Contact</span></li>
        </ul>
      </nav>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        <button className="btn" onClick={() => navigate("/auth")}>Login</button>
        <button className="btn btn-primary" onClick={() => navigate("/auth")}>Register</button>
      </div>
    </header>
  );
}
