function RoadmapSection() {
    const steps = [
        {
            number: "01",
            title: "Create Profile",
            description:
                "Complete your profile, add skills, resume and career goals.",
        },
        {
            number: "02",
            title: "Skill Assessment",
            description:
                "Take aptitude and technical assessments to identify strengths.",
        },
        {
            number: "03",
            title: "Practice Interviews",
            description:
                "Attend AI-powered mock interviews and coding rounds.",
        },
        {
            number: "04",
            title: "Placement Ready",
            description:
                "Improve weak areas and achieve your placement readiness score.",
        },
    ];

    return (
        <section className="py-5">
            <div className="container">

                <div className="text-center mb-5">
                    <h2 className="fw-bold">
                        Your Placement Journey
                    </h2>

                    <p className="text-muted">
                        Follow a structured path to become placement ready.
                    </p>
                </div>

                <div className="row g-4">
                    {steps.map((step, index) => (
                        <div className="col-md-6 col-lg-3" key={index}>
                            <div
                                className="card border-0 shadow-sm h-100"
                                style={{ borderRadius: "20px" }}
                            >
                                <div className="card-body p-4">

                                    <h1 className="text-primary fw-bold">
                                        {step.number}
                                    </h1>

                                    <h5 className="fw-bold mt-3">
                                        {step.title}
                                    </h5>

                                    <p className="text-muted">
                                        {step.description}
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

export default RoadmapSection;