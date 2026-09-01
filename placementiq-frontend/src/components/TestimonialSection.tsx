function TestimonialSection() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer",
      company: "TCS",
      review:
        "PlacementIQ helped me improve my aptitude and interview skills significantly.",
    },
    {
      name: "Priya Singh",
      role: "Frontend Developer",
      company: "Infosys",
      review:
        "The AI Mock Interview feature gave me confidence before my actual interview.",
    },
    {
      name: "Aman Verma",
      role: "Java Developer",
      company: "Wipro",
      review:
        "The coding assessments and analytics helped me identify weak areas.",
    },
  ];

  return (
    <section className="py-5">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="fw-bold">
            Success Stories
          </h2>

          <p className="text-muted">
            Students who improved their placement readiness with PlacementIQ.
          </p>
        </div>

        <div className="row g-4">
          {testimonials.map((item, index) => (
            <div className="col-lg-4" key={index}>
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-4">

                  <p className="text-muted">
                    "{item.review}"
                  </p>

                  <h5 className="fw-bold mt-4">
                    {item.name}
                  </h5>

                  <small className="text-secondary">
                    {item.role} • {item.company}
                  </small>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default TestimonialSection;