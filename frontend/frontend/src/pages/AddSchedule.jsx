import React, { useState } from "react";
import axios from "axios";

export default function AddSchedule() {
  const [formData, setFormData] = useState({
    title: "",
    exam_date: "",
    start_time: "",
  });
  const [message, setMessage] = useState("");

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // 🔑 store your JWT token after login

      const res = await axios.post(
        "http://localhost:3000/schedule/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send Bearer token
          },
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Error adding schedule");
      } else {
        setMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter title"
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
        <button type="submit">Add Schedule</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
