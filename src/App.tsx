import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/dashboards/AdminDashboards";
import TeacherDashboard from "./Pages/teachers/TeacherDashboard";
import ParentDashboard from "./Pages/dashboards/ParentDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./Pages/Register";
import Home from "./Pages/home"; 
import StudentQuiz from "./Components/StudentQuiz";
import Navbar from "./Components/Navbar";
import About from "./Pages/about";
import Features from "./Pages/Feautures";
import Contact from "./Pages/Contact";
import Attendance from './Pages/teachers/Attendance';
import Results from './Pages/teachers/Results';

import Chat from './Pages/teachers/Chat';
import Notifications from './Pages/teachers/Notifications';
import { CreateAnnouncement } from './Components/CreateAnnouncement';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<StudentQuiz />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/attendance" element={<Attendance />} />
          <Route path="/results" element={<Results />} />
          
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
      

        {/* Protected Routes */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
    path="/create-announcement" 
    element={
      ['teacher', 'admin'].includes(localStorage.getItem('role') || '') ? (
        <CreateAnnouncement />
      ) : (
        <Navigate to="/announcements" />
      )
    } 
  />
        {/* Fallback Route */}
        <Route path="*" element={<p className="text-center mt-10">Page not found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
