import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import AptitudeTest from "./pages/AptitudeTest";
import SkillAssessment from "./pages/SkillAssessment";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />

        <Route path="/profile" element={<Profile />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/skill-assessment" element={<SkillAssessment />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
