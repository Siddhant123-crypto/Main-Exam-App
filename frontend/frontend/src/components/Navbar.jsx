import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Navbar() {
  const navigate = useNavigate();

  // Optional: smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      {/* Left side (Logo + Links) */}
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="nav-links">
          <span onClick={() => scrollToSection("home")}>Home</span>
          <span onClick={() => scrollToSection("about")}>About</span>
          <span onClick={() => scrollToSection("features")}>Features</span>
          <span onClick={() => scrollToSection("footer")}>Contact</span>
        </div>
      </div>

      {/* Right side (Auth buttons) */}
      <div className="navbar-right">
        <button className="btn login-btn" onClick={() => navigate("/auth")}>
          Login
        </button>
        <button className="btn signup-btn" onClick={() => navigate("/auth")}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
