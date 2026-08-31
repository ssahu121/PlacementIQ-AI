function FeaturesSection() {
  const features = [
    {
      title: "AI Mock Interviews",
      description:
        "Practice real interview scenarios with AI-generated technical and HR questions.",
      icon: "bi-robot",
    },
    {
      title: "Skill Assessment",
      description:
        "Analyze your strengths and weaknesses through personalized assessments.",
      icon: "bi-clipboard-data",
    },
    {
      title: "Coding Challenges",
      description:
        "Solve coding problems and improve problem-solving skills with instant feedback.",
      icon: "bi-code-slash",
    },
    {
      title: "Placement Analytics",
      description:
        "Track readiness score, interview history, and overall placement progress.",
      icon: "bi-graph-up-arrow",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Everything You Need for Placement Preparation
          </h2>

          <p className="text-muted">
            One platform to prepare, practice and get placement ready.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4">

                  <i
                    className={`bi ${feature.icon} fs-1 text-primary`}
                  ></i>

                  <h5 className="fw-bold mt-3">
                    {feature.title}
                  </h5>

                  <p className="text-muted">
                    {feature.description}
                  </p>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;