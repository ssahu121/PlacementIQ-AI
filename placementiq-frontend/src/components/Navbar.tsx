import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">
        <a className="navbar-brand fw-bold fs-3" href="/">
          PlacementIQ
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
             <a className="navbar-brand" href="/">
                Features
              </a>
            </li>

            <li className="nav-item">
             <a className="navbar-brand" href="/">
                Roadmap
              </a>
            </li>

            <li className="nav-item">
              <a className="navbar-brand" href="/">
                Modules
              </a>
            </li>

            <li className="nav-item">
             <a className="navbar-brand" href="/">
                About
              </a>
            </li>
          </ul>

          <div>
            <Link to="/login" className="btn btn-outline-primary me-2">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
