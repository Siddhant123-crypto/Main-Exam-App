import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    exam_date: "",
    start_time: "",
  });
  const [message, setMessage] = useState("");

  // Load existing schedule
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const schedule = res.data;
        setFormData({
          title: schedule.title,
          exam_date: schedule.exam_date?.split("T")[0] || "", // ✅ clean for <input type="date">
          start_time: schedule.start_time,
        });
      })
      .catch(() => setMessage("Failed to load schedule"));
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // ✅ ensure exam_date is formatted correctly
    const cleanData = {
      ...formData,
      exam_date: formData.exam_date?.split("T")[0] || formData.exam_date,
    };

    axios
      .put(`http://localhost:3000/schedule/update/${id}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessage(res.data.message);
        setTimeout(() => navigate("/schedule/all"), 1000); // redirect after success
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Failed to update schedule");
      });
  };

  return (
    <div className="form-container">
      <h2>Update Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="exam_date"
          value={formData.exam_date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <button type="submit">Update Schedule</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
