import React from "react";
import { Line } from "react-chartjs-2";
import "../index.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartComponent() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Exams Conducted",
        data: [65, 70, 68, 75, 80, 78],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4,
        pointBackgroundColor: "#2c3e50",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "white",
        },
      },
      title: { 
        display: true, 
        text: "📊 Monthly Exam Trends",
        color: "white",
        font: { size: 18, weight: "bold", family: "Arial, sans-serif" },
        padding: { top: 10, bottom: 30 },
      },
    },
    scales: {
      x: {
        grid: { color: "white"},
        ticks: { color: "white",font:{weight:"bold"}},
      },
      y: {
        grid: { color: "white"},
        ticks: { color: "white",font:{weight:"bold"}},
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartComponent;
