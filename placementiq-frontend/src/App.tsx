import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import AptitudeTest from "./pages/AptitudeTest";
import SkillAssessment from "./pages/SkillAssessment";
import ProtectedRoute from "./components/ProtectedRoute";
import TechnicalTest from "./pages/TechnicalTest";
import CodingRound from "./pages/CodingRound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/skill-assessment" element={<SkillAssessment />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route
          path="/technical-test"
          element={
            <ProtectedRoute>
              <TechnicalTest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coding-round"
          element={
            <ProtectedRoute>
              <CodingRound />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
