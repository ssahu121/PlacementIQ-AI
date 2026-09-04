import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className="col-md-3 col-lg-2 min-vh-100 p-4 d-flex flex-column"
          style={{ background: "#0f172a", color: "white" }}
        >
          <h3 className="fw-bold mb-5">PlacementIQ</h3>

          <ul className="nav flex-column flex-grow-1">
            <li className="nav-item mb-3">Dashboard</li>
            <li className="nav-item mb-3">Profile</li>
            <li className="nav-item mb-3"><Link
              to="/skill-assessment"
              className="text-white text-decoration-none"
            >
              Skill Assessment
            </Link></li>
            <li className="nav-item mb-3">Aptitude Test</li>
            <li className="nav-item mb-3">Technical Test</li>
            <li className="nav-item mb-3">Coding Round</li>
            <li className="nav-item mb-3">AI Interview</li>
            <li className="nav-item mb-3">Reports</li>
          </ul>

          {/* Logout Bottom */}
          <button
            className="btn btn-danger w-100 mt-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="fw-bold">Welcome Back 👋</h2>

          <p className="text-muted">
            Track your placement preparation progress.
          </p>

          {/* Tumhara baki dashboard code same rahega */}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
