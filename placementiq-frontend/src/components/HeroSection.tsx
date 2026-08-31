function HeroSection() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center min-vh-75">

          {/* Left Side */}
          <div className="col-lg-6">

            <span className="badge bg-primary px-3 py-2 mb-3">
              AI Powered Placement Preparation
            </span>

            <h1
              className="fw-bold mb-4"
              style={{
                fontSize: "4rem",
                lineHeight: "1.1"
              }}
            >
              Get Placement Ready
              <br />
              with AI Mock
              <br />
              Interviews
            </h1>

            <p className="text-muted fs-5 mb-4">
              Practice aptitude, coding, technical interviews
              and HR rounds on one platform. Improve your
              skills and increase your placement readiness.
            </p>

            <div>
              <button className="btn btn-primary btn-lg me-3">
                Start Free Assessment
              </button>

              <button className="btn btn-outline-dark btn-lg">
                Watch Demo
              </button>
            </div>

          </div>

          {/* Right Side */}
          <div className="col-lg-6">

            <div
              className="card border-0 shadow-lg p-4"
              style={{
                borderRadius: "25px"
              }}
            >
              <h4 className="fw-bold">
                Placement Readiness
              </h4>

              <div className="progress my-4">
                <div
                  className="progress-bar"
                  style={{ width: "78%" }}
                >
                  78%
                </div>
              </div>

              <div className="row text-center">

                <div className="col-3">
                  <h4>82</h4>
                  <small>Aptitude</small>
                </div>

                <div className="col-3">
                  <h4>76</h4>
                  <small>Technical</small>
                </div>

                <div className="col-3">
                  <h4>80</h4>
                  <small>Coding</small>
                </div>

                <div className="col-3">
                  <h4>74</h4>
                  <small>Interview</small>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;