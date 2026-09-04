import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.fullName);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userRole", response.data.role);

      navigate("/student/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

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
                  <h2 className="fw-bold">Welcome Back</h2>

                  <p className="text-muted">
                    Login to continue your placement journey
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Password</label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">Don't have an account?</span>

                  <Link to="/register" className="ms-2 text-decoration-none">
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
