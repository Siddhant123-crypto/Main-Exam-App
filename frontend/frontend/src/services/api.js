import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Add token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = (url, cfg) => API.get(url, cfg);
export const post = (url, data, cfg) => API.post(url, data, cfg);
export const put = (url, data, cfg) => API.put(url, data, cfg);
export const del = (url, cfg) => API.delete(url, cfg);

// Example: Exams API
export const getExams = () => get("/api/exam/view"); 
// src/services/api.js

export const getExamStats = () => get("/api/exam/stats");


export default API;
