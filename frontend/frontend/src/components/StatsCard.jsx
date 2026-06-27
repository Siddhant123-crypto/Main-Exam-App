import React from "react";

function StatsCard({ title, value, color }) {
  return (
    <div className="stats-card" style={{ borderLeft: `5px solid ${color}` }}>
      <h3>{title}</h3>
      <p>{value}</p>
      <span className="updated-text">Updated now</span>
    </div>
  );
}

export default StatsCard;
