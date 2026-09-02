import { Link } from "react-router-dom";

function Register() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: "#f8fafc" }}
    >
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-7">

            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    Create Account
                  </h2>

                  <p className="text-muted">
                    Start your placement preparation today
                  </p>
                </div>

                <form>

                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <select className="form-select">
                        <option>Student</option>
                        <option>College</option>
                        <option>Recruiter</option>
                      </select>
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Create Account
                  </button>

                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    Already have an account?
                  </span>

                  <Link
                    to="/login"
                    className="ms-2 text-decoration-none"
                  >
                    Login
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

export default Register;