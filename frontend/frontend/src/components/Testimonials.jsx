import React from "react";

export default function Testimonials() {
  const items = [
    { name: "Aditi S.", text: "Clean, simple, and saves us hours every exam cycle." },
    { name: "Rahul K.", text: "Teachers love the workflow. Students get results instantly." },
    { name: "Marina P.", text: "Great analytics for departments and leadership." },
  ];
  return (
    <section className="section" aria-label="Testimonials">
      <h2 className="section-title">What users say</h2>
      <div className="grid-3">
        {items.map((t, i) => (
          <div key={i} className="card">
            <p className="quote">“{t.text}”</p>
            <div className="muted">— {t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
