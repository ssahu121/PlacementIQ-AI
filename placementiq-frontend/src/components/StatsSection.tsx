function StatsSection() {
    const stats = [
        {
            number: "10,000+",
            title: "Students",
        },
        {
            number: "500+",
            title: "Mock Interviews",
        },
        {
            number: "95%",
            title: "Success Rate",
        },
        {
            number: "100+",
            title: "Partner Colleges",
        },
    ];

    return (
        <section
            className="py-5"
            style={{
                background: "#0f172a",
            }}
        >
            <div className="container">
                <div className="row text-center">

                    {stats.map((item, index) => (
                        <div className="col-md-3 mb-4" key={index}>

                            <h2
                                className="fw-bold text-white"
                                style={{ fontSize: "3rem" }}
                            >
                                {item.number}
                            </h2>

                            <p
                                className="mb-0"
                                style={{
                                    color: "#cbd5e1",
                                    fontSize: "1.1rem",
                                }}
                            >
                                {item.title}
                            </p>

                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default StatsSection;