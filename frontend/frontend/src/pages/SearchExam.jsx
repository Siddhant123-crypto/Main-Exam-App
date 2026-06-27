// src/pages/SearchExam.jsx
import React, { useState } from "react";


export default function SearchExam() {
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.get("/exam/search", { params: { date } });
      setResults(data);
    } catch {
      alert("Search failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Exams by Date</h2>
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((ex) => (
            <tr key={ex.id}>
              <td className="p-2 border">{ex.id}</td>
              <td className="p-2 border">{ex.name}</td>
              <td className="p-2 border">{ex.exam_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
