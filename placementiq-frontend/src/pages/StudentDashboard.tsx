import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  userId: number;

  aptitude: number;
  technical: number;
  coding: number;

  aptitudePassed: boolean;
  technicalPassed: boolean;
  codingPassed: boolean;

  roundsCleared: number;
  totalRounds: number;
  attemptedRounds: number;

  overall: number;
}

function StudentDashboard() {
  
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Student";
  const userId = localStorage.getItem("userId");

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD DASHBOARD =================

  useEffect(() => {
    const loadDashboard = async () => {
      if (!userId) {
        setError("User login information not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<DashboardData>(
          `http://localhost:8080/api/dashboard/${userId}`
        );

        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError("Dashboard data load nahi ho pa raha.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userId]);


  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    navigate("/login");
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <h5>Loading your dashboard...</h5>
        </div>
      </div>
    );
  }


  // ================= ERROR =================

  if (error || !dashboard) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <h4 className="text-danger">
            {error || "Unable to load dashboard"}
          </h4>

          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


// ================= DATA =================

const aptitude = dashboard.aptitude;
const technical = dashboard.technical;
const coding = dashboard.coding;

const aptitudeAttempted = aptitude > 0;
const technicalAttempted = technical > 0;
const codingAttempted = coding > 0;


// ================= CHART DATA =================

const chartData = [
  {
    name: "Aptitude",
    score: aptitude,
  },
  {
    name: "Technical",
    score: technical,
  },
  {
    name: "Coding",
    score: coding,
  },
];


  // ================= STATUS =================

  const placementReady =
    dashboard.roundsCleared === dashboard.totalRounds;

  const placementStatus = placementReady
    ? "Placement Ready"
    : "In Progress";


  // ================= IMPROVEMENT =================

  const weakestScore = Math.min(
    aptitudeAttempted ? aptitude : 101,
    technicalAttempted ? technical : 101,
    codingAttempted ? coding : 101
  );

  let improvementTitle = "";
  let improvementText = "";

  if (weakestScore === 101) {
    improvementTitle = "Start Your Preparation";
    improvementText =
      "Attempt your first assessment to see your performance.";
  } else if (codingAttempted && coding === weakestScore) {
    improvementTitle = "Coding";
    improvementText =
      "Practice problem solving and coding questions regularly.";
  } else if (technicalAttempted && technical === weakestScore) {
    improvementTitle = "Technical";
    improvementText =
      "Revise your core technical concepts and framework fundamentals.";
  } else {
    improvementTitle = "Aptitude";
    improvementText =
      "Practice quantitative, logical and verbal questions.";
  }


  return (
    <div className="container-fluid p-0">

      <div className="row g-0">

        {/* ================= SIDEBAR ================= */}

        <div
          className="col-md-3 col-lg-2 min-vh-100 p-4 d-flex flex-column"
          style={{
            background: "#0f172a",
            color: "white",
          }}
        >

          <h3 className="fw-bold mb-5">
            Placement
            <span style={{ color: "#38bdf8" }}>
              IQ
            </span>
          </h3>


          <ul className="nav flex-column flex-grow-1">

            <li className="nav-item mb-3">
              <Link
                to="/student/dashboard"
                className="text-white text-decoration-none"
              >
                🏠 Dashboard
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/profile"
                className="text-white text-decoration-none"
              >
                👤 Profile
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/skill-assessment"
                className="text-white text-decoration-none"
              >
                🧠 Skill Assessment
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/aptitude-test"
                className="text-white text-decoration-none"
              >
                📝 Aptitude Test
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/technical-test"
                className="text-white text-decoration-none"
              >
                💻 Technical Test
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/coding-round"
                className="text-white text-decoration-none"
              >
                👨‍💻 Coding Round
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/ai-interview"
                className="text-white text-decoration-none"
              >
                🤖 AI Interview
              </Link>
            </li>

            <li className="nav-item mb-3">
              <Link
                to="/reports"
                className="text-white text-decoration-none"
              >
                📊 Reports
              </Link>
            </li>

          </ul>


          <button
            className="btn btn-danger w-100 mt-auto"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* ================= MAIN CONTENT ================= */}

        <div
          className="col-md-9 col-lg-10 p-4"
          style={{
            background: "#f8fafc",
            minHeight: "100vh",
          }}
        >

          {/* ================= HEADER ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h2 className="fw-bold mb-1">
                Welcome Back, {userName} 👋
              </h2>

              <p className="text-muted mb-0">
                Track your placement preparation progress.
              </p>

            </div>


            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                background: "#0f172a",
                color: "white",
                fontSize: "22px",
              }}
            >
              👤
            </div>

          </div>


          {/* ================= SUMMARY CARDS ================= */}

          <div className="row g-4 mb-4">

            {/* Overall */}

            <div className="col-md-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <p className="text-muted mb-2">
                    Overall Score
                  </p>

                  <h2 className="fw-bold mb-1">
                    {Math.round(dashboard.overall)}%
                  </h2>

                  <small
                    className={
                      dashboard.overall >= 70
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {dashboard.overall >= 70
                      ? "↑ Good progress"
                      : "Keep improving"}
                  </small>

                </div>

              </div>

            </div>


            {/* Mock Tests */}

            <div className="col-md-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <p className="text-muted mb-2">
                    Mock Tests Given
                  </p>

                  <h2 className="fw-bold mb-1">
                    {dashboard.attemptedRounds}
                  </h2>

                  <small className="text-muted">
                    Placement rounds attempted
                  </small>

                </div>

              </div>

            </div>


            {/* Rounds */}

            <div className="col-md-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <p className="text-muted mb-2">
                    Rounds Cleared
                  </p>

                  <h2 className="fw-bold mb-1">
                    {dashboard.roundsCleared} /{" "}
                    {dashboard.totalRounds}
                  </h2>

                  <small className="text-success">
                    {dashboard.roundsCleared ===
                    dashboard.totalRounds
                      ? "All rounds cleared!"
                      : "Keep going!"}
                  </small>

                </div>

              </div>

            </div>


            {/* Placement */}

            <div className="col-md-6 col-xl-3">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <p className="text-muted mb-2">
                    Placement Status
                  </p>

                  <h4
                    className={
                      placementReady
                        ? "fw-bold text-success mb-1"
                        : "fw-bold text-warning mb-1"
                    }
                  >
                    {placementStatus}
                  </h4>

                  <small className="text-muted">
                    {placementReady
                      ? "Great work!"
                      : "Complete remaining rounds"}
                  </small>

                </div>

              </div>

            </div>

          </div>


          {/* ================= PERFORMANCE ================= */}

          <div className="row g-4 mb-4">


            {/* Performance */}

            <div className="col-lg-8">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                      <h5 className="fw-bold mb-1">
                        Round Performance
                      </h5>

                      <small className="text-muted">
                        Your performance in each placement round
                      </small>

                    </div>

                    <span className="badge bg-light text-dark">
                      Live
                    </span>

                  </div>


                  {/* Aptitude */}

                  <div className="mb-4">

                    <div className="d-flex justify-content-between mb-2">

                      <span className="fw-semibold">
                        📝 Aptitude
                      </span>

                      <span className="fw-bold">
                        {aptitudeAttempted
                          ? `${Math.round(aptitude)}%`
                          : "Not Attempted"}
                      </span>

                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >

                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${aptitude}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* Technical */}

                  <div className="mb-4">

                    <div className="d-flex justify-content-between mb-2">

                      <span className="fw-semibold">
                        💻 Technical
                      </span>

                      <span className="fw-bold">
                        {technicalAttempted
                          ? `${Math.round(technical)}%`
                          : "Not Attempted"}
                      </span>

                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >

                      <div
                        className="progress-bar bg-info"
                        style={{
                          width: `${technical}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* Coding */}

                  <div className="mb-4">

                    <div className="d-flex justify-content-between mb-2">

                      <span className="fw-semibold">
                        👨‍💻 Coding
                      </span>

                      <span className="fw-bold">
                        {codingAttempted
                          ? `${Math.round(coding)}%`
                          : "Not Attempted"}
                      </span>

                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >

                      <div
                        className="progress-bar bg-warning"
                        style={{
                          width: `${coding}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* AI */}

                  <div>

                    <div className="d-flex justify-content-between mb-2">

                      <span className="fw-semibold">
                        🤖 AI Interview
                      </span>

                      <span className="fw-bold">
                        Not Attempted
                      </span>

                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >

                      <div
                        className="progress-bar bg-secondary"
                        style={{
                          width: "0%",
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Improvement */}

            <div className="col-lg-4">

              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">

  <div>
    <h5 className="fw-bold mb-1">
      Round Performance
    </h5>

    <small className="text-muted">
      Your performance in each placement round
    </small>
  </div>

  <span className="badge bg-light text-dark">
    Live
  </span>

</div>
{/* ================= PERFORMANCE CHART ================= */}

<div
  style={{
    width: "100%",
    height: "300px",
  }}
>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={chartData}
      margin={{
        top: 10,
        right: 20,
        left: 0,
        bottom: 10,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis
        domain={[0, 100]}
        tickFormatter={(value) => `${value}%`}
      />

      <Tooltip
        formatter={(value) => [`${value}%`, "Score"]}
      />

      <Bar
        dataKey="score"
        name="Score"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

                  <h5 className="fw-bold mb-1">
                    Where to Improve
                  </h5>

                  <p className="text-muted small">
                    Focus on your weakest area
                  </p>


                  <div
                    className="p-3 rounded mb-3"
                    style={{
                      background: "#fff7ed",
                    }}
                  >

                    <div className="fw-bold text-warning">
                      🎯 {improvementTitle}
                    </div>

                    <small className="text-muted">
                      {improvementText}
                    </small>

                  </div>


                  <div
                    className="p-3 rounded"
                    style={{
                      background: "#f0fdf4",
                    }}
                  >

                    <div className="fw-bold text-success">
                      📈 Current Overall
                    </div>

                    <small className="text-muted">
                      Your current overall score is{" "}
                      <strong>
                        {Math.round(dashboard.overall)}%
                      </strong>
                      .
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================= ROUND STATUS ================= */}

          <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

              <h5 className="fw-bold mb-4">
                Placement Journey
              </h5>


              <div className="row g-3">


                {/* Aptitude */}

                <div className="col-md-3">

                  <div className="border rounded p-3 h-100">

                    <div className="fs-3 mb-2">
                      📝
                    </div>

                    <h6 className="fw-bold">
                      Aptitude
                    </h6>

                    <span
                      className={
                        dashboard.aptitudePassed
                          ? "badge bg-success"
                          : aptitudeAttempted
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {dashboard.aptitudePassed
                        ? "Passed"
                        : aptitudeAttempted
                        ? "Failed"
                        : "Not Attempted"}
                    </span>

                    <div className="mt-2 text-muted small">

                      {aptitudeAttempted
                        ? `Score: ${Math.round(aptitude)}%`
                        : "No attempt yet"}

                    </div>

                  </div>

                </div>


                {/* Technical */}

                <div className="col-md-3">

                  <div className="border rounded p-3 h-100">

                    <div className="fs-3 mb-2">
                      💻
                    </div>

                    <h6 className="fw-bold">
                      Technical
                    </h6>

                    <span
                      className={
                        dashboard.technicalPassed
                          ? "badge bg-success"
                          : technicalAttempted
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {dashboard.technicalPassed
                        ? "Passed"
                        : technicalAttempted
                        ? "Failed"
                        : "Not Attempted"}
                    </span>

                    <div className="mt-2 text-muted small">

                      {technicalAttempted
                        ? `Score: ${Math.round(technical)}%`
                        : "No attempt yet"}

                    </div>

                  </div>

                </div>


                {/* Coding */}

                <div className="col-md-3">

                  <div className="border rounded p-3 h-100">

                    <div className="fs-3 mb-2">
                      👨‍💻
                    </div>

                    <h6 className="fw-bold">
                      Coding
                    </h6>

                    <span
                      className={
                        dashboard.codingPassed
                          ? "badge bg-success"
                          : codingAttempted
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {dashboard.codingPassed
                        ? "Passed"
                        : codingAttempted
                        ? "Needs Improvement"
                        : "Not Attempted"}
                    </span>

                    <div className="mt-2 text-muted small">

                      {codingAttempted
                        ? `Score: ${Math.round(coding)}%`
                        : "No attempt yet"}

                    </div>

                  </div>

                </div>


                {/* AI */}

                <div className="col-md-3">

                  <div className="border rounded p-3 h-100">

                    <div className="fs-3 mb-2">
                      🤖
                    </div>

                    <h6 className="fw-bold">
                      AI Interview
                    </h6>

                    <span className="badge bg-secondary">
                      Pending
                    </span>

                    <div className="mt-2 text-muted small">
                      Not attempted
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ================= QUICK ACTIONS ================= */}

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h5 className="fw-bold mb-3">
                Continue Preparation 🚀
              </h5>

              <div className="d-flex flex-wrap gap-2">

                <Link
                  to="/aptitude-test"
                  className="btn btn-outline-primary"
                >
                  Take Aptitude Test
                </Link>

                <Link
                  to="/technical-test"
                  className="btn btn-outline-info"
                >
                  Take Technical Test
                </Link>

                <Link
                  to="/coding-round"
                  className="btn btn-outline-warning"
                >
                  Practice Coding
                </Link>

                <Link
                  to="/ai-interview"
                  className="btn btn-outline-dark"
                >
                  Start AI Interview
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;