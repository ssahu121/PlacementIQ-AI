import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await registerUser(formData);

      alert(response.data);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "STUDENT",
      });
    } catch (error) {
      alert("Registration Failed");
    }
  };

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
                  <h2 className="fw-bold">Create Account</h2>

                  <p className="text-muted">
                    Start your placement preparation today
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="COLLEGE">College</option>
                        <option value="RECRUITER">Recruiter</option>
                        <option value="ADMIN">Admin</option>
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