import { useState } from "react";

export default function ScheduleForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { title: "", date: "", time: "", description: "" }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-3"
          onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange}
             placeholder="Title" required className="w-full border p-2 rounded" />

      <input type="date" name="date" value={formData.date}
             onChange={handleChange} required className="w-full border p-2 rounded" />

      <input type="time" name="time" value={formData.time}
             onChange={handleChange} required className="w-full border p-2 rounded" />

      <textarea name="description" value={formData.description}
                onChange={handleChange} placeholder="Description"
                className="w-full border p-2 rounded" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        💾 Save
      </button>
    </form>
  );
}
