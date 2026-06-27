import React from "react";

function Features() {
  return (
    <section className="features-section" id="features">
      <h2 className="features-title">Features</h2>

      <div className="features-container">
        <div className="feature-card orange">
          <div className="feature-icon">📖</div>
          <h3>Online Exams</h3>
          <p>
            Seamlessly conduct secure online examinations with advanced
            proctoring and real-time monitoring capabilities.
          </p>
        </div>

        <div className="feature-card blue">
          <div className="feature-icon">⏰</div>
          <h3>Time Management</h3>
          <p>
            Intelligent scheduling system with automated reminders and flexible
            timing controls for optimal productivity.
          </p>
        </div>

        <div className="feature-card yellow">
          <div className="feature-icon">🛡️</div>
          <h3>Secure System</h3>
          <p>
            Enterprise-grade security with end-to-end encryption, multi-factor
            authentication, and compliance standards.
          </p>
        </div>

        <div className="feature-card purple">
          <div className="feature-icon">📊</div>
          <h3>Detailed Reports</h3>
          <p>
            Comprehensive analytics dashboard with real-time insights,
            performance metrics, and exportable data visualizations.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <p className="cta-text">
          Experience the future of digital education with our comprehensive
          platform designed for modern learning environments.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary">Get Started Today</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
}

export default Features;
