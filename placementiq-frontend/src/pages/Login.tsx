import { Link } from "react-router-dom";

function Login() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: "#f8fafc" }}
    >
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    Welcome Back
                  </h2>

                  <p className="text-muted">
                    Login to continue your placement journey
                  </p>
                </div>

                <form>

                  <div className="mb-3">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Login
                  </button>

                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Don't have an account?
                  </span>

                  <Link
                    to="/register"
                    className="ms-2 text-decoration-none"
                  >
                    Register
                  </Link>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;