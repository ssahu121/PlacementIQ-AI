function ModuleSection() {
  const modules = [
    {
      title: "Aptitude Assessment",
      desc: "Quantitative, Logical Reasoning and Verbal Tests",
    },
    {
      title: "Technical Assessment",
      desc: "Java, Spring Boot, SQL, React and more",
    },
    {
      title: "Coding Challenges",
      desc: "Practice coding with real interview questions",
    },
    {
      title: "AI Mock Interview",
      desc: "Experience real technical and HR interviews",
    },
    {
      title: "Performance Reports",
      desc: "Detailed analytics and placement readiness score",
    },
    {
      title: "Learning Roadmap",
      desc: "Personalized recommendations for improvement",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Placement Preparation Modules
          </h2>

          <p className="text-muted">
            Everything you need to crack placements.
          </p>
        </div>

        <div className="row g-4">

          {modules.map((module, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4">

                  <h5 className="fw-bold">
                    {module.title}
                  </h5>

                  <p className="text-muted">
                    {module.desc}
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

export default ModuleSection;