function Footer() {
  return (
    <footer
      className="py-5"
      style={{
        background: "#0f172a",
        color: "white",
      }}
    >
      <div className="container">

        <div className="row">

          <div className="col-lg-4">
            <h3 className="fw-bold">
              PlacementIQ
            </h3>

            <p className="text-light">
              AI Powered Placement Preparation Platform.
            </p>
          </div>

          <div className="col-lg-4">
            <h5>Quick Links</h5>

            <ul className="list-unstyled">
              <li>Home</li>
              <li>Features</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="col-lg-4">
            <h5>Contact</h5>

            <p>Email: support@placementiq.com</p>

            <p>Phone: +91 96483 88643</p>
          </div>

        </div>

        <hr />

        <div className="text-center">
          © 2026 PlacementIQ. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;