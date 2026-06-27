import React from "react";
import "../index.css";

function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left Side - Text */}
        <div className="about-text">
          <h2 className="about-title">
            About <span className="highlight-blue">Exam</span> Application
          </h2>

          <p className="about-subtitle">
            Transform your educational assessment experience with our
            comprehensive, intelligent exam platform designed for modern
            learning environments.
          </p>

          <ul className="about-features">
            <li>Seamless permissions for Admin, Teacher, and Student roles</li>
            <li>Intelligent assessment with detailed performance insights</li>
            <li>Perfect experience across all devices and platforms</li>
            <li>Live exam monitoring with precision timing controls</li>
          </ul>

          <div className="about-buttons">
            <button className="btn-primary">Explore Features 👁️</button>
            <button className="btn-outline">Contact Us →</button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="about-image">
          {/* ✅ Public folder path */}
          <img src="/public/fun1.png" alt="Exam Application" />
        </div>
      </div>
    </section>
  );
}

export default About;
