import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-dark text-white mt-5"
      style={{
        borderTop: "1px solid #e5e7eb",
      }}
    >

      <div className="container py-5">

        <div className="row g-4">

          {/* BRAND */}

          <div className="col-lg-5">

            <h4 className="fw-bold text-white mb-3">
              PlacementIQ-AI
            </h4>

            <p
              className="text-white-50 mb-3"
              style={{
                maxWidth: "420px",
                lineHeight: "1.7",
              }}
            >
              An AI-powered placement preparation
              platform designed to help students
              practice aptitude, technical skills,
              coding and mock interviews.
            </p>

            <div className="d-flex gap-2">

              <span
                className="badge bg-primary"
                style={{
                  padding: "8px 12px",
                }}
              >
                AI Powered
              </span>

              <span
                className="badge bg-success"
                style={{
                  padding: "8px 12px",
                }}
              >
                Placement Ready
              </span>

            </div>

          </div>


          {/* QUICK LINKS */}

          <div className="col-sm-6 col-lg-2">

            <h6 className="fw-bold mb-3">
              Quick Links
            </h6>

            <div className="d-flex flex-column gap-2">

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/dashboard")
                }
              >
                Dashboard
              </button>

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/aptitude")
                }
              >
                Aptitude
              </button>

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/technical")
                }
              >
                Technical
              </button>

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/coding")
                }
              >
                Coding
              </button>

            </div>

          </div>


          {/* PREPARATION */}

          <div className="col-sm-6 col-lg-2">

            <h6 className="fw-bold mb-3">
              Preparation
            </h6>

            <div className="d-flex flex-column gap-2">

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/ai-interview")
                }
              >
                AI Interview
              </button>

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/report")
                }
              >
                Performance Report
              </button>

              <button
                type="button"
                className="btn btn-link text-white-50 text-start p-0 text-decoration-none"
                onClick={() =>
                  navigate("/student/profile")
                }
              >
                My Profile
              </button>

            </div>

          </div>


          {/* SUPPORT */}

          <div className="col-lg-3">

            <h6 className="fw-bold mb-3">
              Platform
            </h6>

            <p className="text-white-50 small mb-2">
              Practice smarter and track your
              placement preparation progress.
            </p>

            <div className="text-white-50 small">
              <div className="mb-2">
                <i className="bi bi-shield-check me-2"></i>
                Secure Student Dashboard
              </div>

              <div className="mb-2">
                <i className="bi bi-graph-up-arrow me-2"></i>
                Performance Tracking
              </div>

              <div>
                <i className="bi bi-robot me-2"></i>
                AI Mock Interview
              </div>
            </div>

          </div>

        </div>


        <hr className="border-secondary my-4" />


        {/* BOTTOM */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">

          <p className="text-white-50 small mb-0">
            © {currentYear} PlacementIQ-AI.
            All rights reserved.
          </p>

          <p className="text-white-50 small mb-0">
            Built for smarter placement preparation.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;