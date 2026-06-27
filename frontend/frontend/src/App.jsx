// src/App.jsx
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route } from "react-router-dom";

// ================= Home Page Components =================
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import Auth from "./components/Auth";
import StudentAuth from "./components/StudentAuth";
import Footer from "./components/Footer";

// ================= Admin/General Pages =================
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Exams from "./pages/Exams";
import Settings from "./pages/Settings";

// ================= Schedule Pages =================
import ScheduleDashboard from "./components/ScheduleDashboard";
import AddSchedule from "./pages/AddSchedule";
import AllSchedules from "./pages/AllSchedules";
import UpdateSchedule from "./pages/UpdateSchedule";
import SearchSchedule from "./pages/SearchSchedule";

// ================= Student Pages =================
import StudentDashboard from "./pages/StudentDashboard";
import MyExam from "./pages/MyExam";
import StudentSchedule from "./pages/StudentSchedule";
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";
import TakeExam from "./pages/TakeExam";

// ✅ Import SubmitExam component
import SubmitExam from "./components/SubmitExam";

function App() {
  return (
    <Routes>
      {/* ================= Home Page ================= */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <Features />
            <About />
            <Auth />
            <StudentAuth />
            <Footer />
          </>
        }
      />

      {/* ================= Admin Dashboard ================= */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/exam" element={<Exams />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/settings" element={<Settings />} />

      {/* ================= Schedule Management ================= */}
      <Route path="/schedule" element={<ScheduleDashboard />}>
        <Route path="add" element={<AddSchedule />} />
        <Route path="view" element={<AllSchedules />} />
        <Route path="update/:id" element={<UpdateSchedule />} />
        <Route path="search" element={<SearchSchedule />} />
      </Route>

      {/* ================= Student Dashboard (Nested Layout) ================= */}
      <Route path="/student-dashboard" element={<StudentDashboard />}>
        <Route path="my-exam" element={<MyExam />} />
        <Route path="take-exam" element={<TakeExam />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />

        {/* ✅ SubmitExam will fetch examId & questions dynamically */}
        <Route path="exam/:examId/submit" element={<SubmitExam />} />
      </Route>

      {/* ================= Catch-all for 404 ================= */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
