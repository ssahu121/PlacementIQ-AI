import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitTechnicalResult } from "../api/technicalApi";

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Java",
    question: "Which keyword is used to create a class in Java?",
    options: ["function", "class", "struct", "object"],
    answer: 1,
  },
  {
    id: 2,
    category: "Java",
    question: "Which method is the entry point of a Java application?",
    options: ["start()", "run()", "main()", "execute()"],
    answer: 2,
  },
  {
    id: 3,
    category: "Java",
    question: "Which of these is NOT a primitive data type in Java?",
    options: ["int", "float", "String", "boolean"],
    answer: 2,
  },
  {
    id: 4,
    category: "Collections",
    question: "Which collection does not allow duplicate elements?",
    options: ["List", "Set", "ArrayList", "LinkedList"],
    answer: 1,
  },
  {
    id: 5,
    category: "OOP",
    question:
      "Which OOP concept allows one class to acquire properties of another class?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Abstraction",
      "Polymorphism",
    ],
    answer: 1,
  },
  {
    id: 6,
    category: "OOP",
    question:
      "Which concept is used to hide internal implementation details?",
    options: [
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Overloading",
    ],
    answer: 2,
  },
  {
    id: 7,
    category: "Java",
    question: "Which keyword is used to inherit a class in Java?",
    options: ["implements", "extends", "inherits", "super"],
    answer: 1,
  },
  {
    id: 8,
    category: "Java",
    question:
      "Which keyword prevents a method from being overridden?",
    options: ["static", "private", "final", "constant"],
    answer: 2,
  },
  {
    id: 9,
    category: "Collections",
    question: "Which interface is implemented by ArrayList?",
    options: ["Set", "List", "Map", "Queue"],
    answer: 1,
  },
  {
    id: 10,
    category: "Exception",
    question:
      "Which block is used to handle an exception in Java?",
    options: ["catch", "handle", "error", "except"],
    answer: 0,
  },
  {
    id: 11,
    category: "Spring Boot",
    question:
      "Which annotation is used to create a REST controller in Spring Boot?",
    options: [
      "@Controller",
      "@RestController",
      "@Service",
      "@Repository",
    ],
    answer: 1,
  },
  {
    id: 12,
    category: "Spring Boot",
    question:
      "Which annotation is commonly used to define a service class?",
    options: [
      "@Service",
      "@ComponentScan",
      "@Bean",
      "@Autowired",
    ],
    answer: 0,
  },
  {
    id: 13,
    category: "Spring Boot",
    question:
      "Which annotation is used to map HTTP GET requests?",
    options: [
      "@PostMapping",
      "@PutMapping",
      "@GetMapping",
      "@RequestBody",
    ],
    answer: 2,
  },
  {
    id: 14,
    category: "Spring Boot",
    question:
      "Which annotation is commonly used for dependency injection?",
    options: [
      "@Autowired",
      "@InjectBean",
      "@Dependency",
      "@Service",
    ],
    answer: 0,
  },
  {
    id: 15,
    category: "JPA",
    question:
      "Which annotation marks a Java class as a JPA entity?",
    options: [
      "@Table",
      "@Entity",
      "@Database",
      "@Model",
    ],
    answer: 1,
  },
  {
    id: 16,
    category: "JPA",
    question:
      "Which annotation is used to mark the primary key of an entity?",
    options: [
      "@Primary",
      "@Key",
      "@Id",
      "@PrimaryKey",
    ],
    answer: 2,
  },
  {
    id: 17,
    category: "SQL",
    question:
      "Which SQL command is used to retrieve data from a table?",
    options: ["GET", "SELECT", "FETCH", "READ"],
    answer: 1,
  },
  {
    id: 18,
    category: "SQL",
    question:
      "Which SQL clause is used to filter rows?",
    options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
    answer: 2,
  },
  {
    id: 19,
    category: "REST API",
    question:
      "Which HTTP method is normally used to create a new resource?",
    options: ["GET", "POST", "DELETE", "HEAD"],
    answer: 1,
  },
  {
    id: 20,
    category: "REST API",
    question:
      "Which HTTP status code means 'Not Found'?",
    options: ["200", "201", "400", "404"],
    answer: 3,
  },
];

const TEST_DURATION = 20 * 60;
const PASS_PERCENTAGE = 65;

function TechnicalTest() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<number[]>(
    []
  );
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const score = useMemo(() => {
    let total = 0;

    QUESTIONS.forEach((item) => {
      if (answers[item.id] === item.answer) {
        total++;
      }
    });

    return total;
  }, [answers]);

  const percentage = Math.round(
    (score / QUESTIONS.length) * 100
  );

  const passed = percentage >= PASS_PERCENTAGE;

  const attempted = Object.keys(answers).length;

  const unanswered = QUESTIONS.length - attempted;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minuteText =
      minutes < 10 ? "0" + minutes : "" + minutes;

    const secondText =
      remainingSeconds < 10
        ? "0" + remainingSeconds
        : "" + remainingSeconds;

    return minuteText + ":" + secondText;
  };

  useEffect(() => {
    if (submitted) {
      return;
    }

    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [timeLeft, submitted]);

  const selectAnswer = (optionIndex: number) => {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));
  };

  const toggleMark = () => {
    setMarkedQuestions((previous) => {
      if (previous.includes(question.id)) {
        return previous.filter(
          (id) => id !== question.id
        );
      }

      return [...previous, question.id];
    });
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      "You have attempted " +
        attempted +
        " of " +
        QUESTIONS.length +
        " questions.\n\nAre you sure you want to submit the Technical Test?"
    );

    if (!confirmed) {
      return;
    }

    const userIdText =
      localStorage.getItem("userId");

    const userId = Number(userIdText);

    if (!userId) {
      alert("User session not found. Please login again.");
      return;
    }

    const selectedStack =
      localStorage.getItem("selectedStack") ||
      "JAVA_FULLSTACK";

    try {
      setSaving(true);

      await submitTechnicalResult({
        userId: userId,
        stack: selectedStack,
        score: score,
        totalQuestions: QUESTIONS.length,
        percentage: percentage,
        passed: passed,
      });

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Technical result submission failed:",
        error
      );

      alert(
        "Failed to save Technical Test result. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const retryTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedQuestions([]);
    setTimeLeft(TEST_DURATION);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="container py-5">
        <div
          className="card border-0 shadow-lg mx-auto"
          style={{ maxWidth: "760px" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div
              className={
                "rounded-circle d-inline-flex align-items-center justify-content-center mb-4 " +
                (passed ? "bg-success" : "bg-danger")
              }
              style={{
                width: "90px",
                height: "90px",
              }}
            >
              <i
                className={
                  "bi text-white " +
                  (passed
                    ? "bi-check-lg"
                    : "bi-x-lg")
                }
                style={{ fontSize: "42px" }}
              ></i>
            </div>

            <h1 className="fw-bold mb-2">
              Technical Test Result
            </h1>

            <p className="text-muted mb-4">
              Java Full Stack Technical Assessment
            </p>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="bg-light rounded-3 p-3">
                  <small className="text-muted">
                    Score
                  </small>
                  <h3 className="fw-bold mb-0">
                    {score}/{QUESTIONS.length}
                  </h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-light rounded-3 p-3">
                  <small className="text-muted">
                    Percentage
                  </small>
                  <h3 className="fw-bold mb-0">
                    {percentage}%
                  </h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-light rounded-3 p-3">
                  <small className="text-muted">
                    Attempted
                  </small>
                  <h3 className="fw-bold mb-0">
                    {attempted}/{QUESTIONS.length}
                  </h3>
                </div>
              </div>
            </div>

            {passed ? (
              <>
                <div className="alert alert-success border-0">
                  <h4 className="fw-bold">
                    Technical Round Cleared
                  </h4>

                  <p className="mb-0">
                    Congratulations! You scored{" "}
                    {percentage}%. Coding Round is now
                    unlocked.
                  </p>
                </div>

                <button
                  className="btn btn-success btn-lg px-5"
                  onClick={() =>
                    navigate("/coding-round")
                  }
                >
                  Continue to Coding Round
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </>
            ) : (
              <>
                <div className="alert alert-danger border-0">
                  <h4 className="fw-bold">
                    Technical Round Not Cleared
                  </h4>

                  <p className="mb-0">
                    You scored {percentage}%. You need at
                    least {PASS_PERCENTAGE}% to unlock
                    the Coding Round.
                  </p>
                </div>

                <button
                  className="btn btn-primary btn-lg px-5"
                  onClick={retryTest}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-5">
      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            Technical Assessment
          </h2>

          <p className="text-muted mb-0">
            Test your Java Full Stack technical knowledge
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary fs-6 px-3 py-2">
            <i className="bi bi-code-slash me-2"></i>
            Java Full Stack
          </span>

          <span
            className={
              "badge fs-6 px-3 py-2 " +
              (timeLeft <= 60
                ? "bg-danger"
                : "bg-dark")
            }
          >
            <i className="bi bi-clock me-2"></i>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">
              Test Progress
            </span>

            <span className="text-muted">
              {currentQuestion + 1} / {QUESTIONS.length}
            </span>
          </div>

          <div
            className="progress"
            style={{ height: "9px" }}
          >
            <div
              className="progress-bar"
              style={{
                width:
                  ((currentQuestion + 1) /
                    QUESTIONS.length) *
                    100 +
                  "%",
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* QUESTION */}

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-light text-dark border px-3 py-2">
                  {question.category}
                </span>

                <span className="text-muted fw-semibold">
                  Question {currentQuestion + 1}
                </span>
              </div>

              <h4 className="fw-bold mb-4">
                {question.question}
              </h4>

              <div className="d-grid gap-3">
                {question.options.map(
                  (option, index) => {
                    const selected =
                      answers[question.id] === index;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={
                          "btn text-start p-3 border rounded-3 " +
                          (selected
                            ? "btn-primary"
                            : "btn-outline-secondary")
                        }
                        onClick={() =>
                          selectAnswer(index)
                        }
                      >
                        <span className="fw-bold me-3">
                          {["A", "B", "C", "D"][index]}.
                        </span>

                        {option}

                        {selected && (
                          <i className="bi bi-check-circle-fill float-end"></i>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 gap-2">
                <button
                  className="btn btn-outline-secondary"
                  disabled={currentQuestion === 0}
                  onClick={() =>
                    setCurrentQuestion(
                      (previous) => previous - 1
                    )
                  }
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Previous
                </button>

                <button
                  className={
                    "btn " +
                    (markedQuestions.includes(
                      question.id
                    )
                      ? "btn-warning"
                      : "btn-outline-warning")
                  }
                  onClick={toggleMark}
                >
                  <i className="bi bi-bookmark me-2"></i>

                  {markedQuestions.includes(
                    question.id
                  )
                    ? "Marked"
                    : "Mark for Review"}
                </button>

                {currentQuestion ===
                QUESTIONS.length - 1 ? (
                  <button
                    className="btn btn-success px-4"
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        Submit Test
                        <i className="bi bi-check-lg ms-2"></i>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary px-4"
                    onClick={() =>
                      setCurrentQuestion(
                        (previous) => previous + 1
                      )
                    }
                  >
                    Next
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                Question Palette
              </h5>

              <div className="d-flex flex-wrap gap-2">
                {QUESTIONS.map((item, index) => {
                  const answered =
                    answers[item.id] !== undefined;

                  const marked =
                    markedQuestions.includes(item.id);

                  let buttonClass =
                    "btn btn-sm ";

                  if (index === currentQuestion) {
                    buttonClass += "btn-primary";
                  } else if (marked) {
                    buttonClass += "btn-warning";
                  } else if (answered) {
                    buttonClass += "btn-success";
                  } else {
                    buttonClass +=
                      "btn-outline-secondary";
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={buttonClass}
                      style={{
                        width: "42px",
                        height: "38px",
                      }}
                      onClick={() =>
                        setCurrentQuestion(index)
                      }
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <hr />

              <div className="d-flex justify-content-between small mb-2">
                <span>
                  <i className="bi bi-circle-fill text-primary me-2"></i>
                  Current
                </span>

                <span>
                  <i className="bi bi-circle-fill text-success me-2"></i>
                  Answered
                </span>
              </div>

              <div className="d-flex justify-content-between small">
                <span>
                  <i className="bi bi-circle-fill text-warning me-2"></i>
                  Review
                </span>

                <span>
                  <i className="bi bi-circle text-secondary me-2"></i>
                  Unanswered
                </span>
              </div>
            </div>
          </div>

          {/* SUMMARY */}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                Test Summary
              </h5>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">
                  Total Questions
                </span>

                <strong>
                  {QUESTIONS.length}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">
                  Attempted
                </span>

                <strong className="text-success">
                  {attempted}
                </strong>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">
                  Unanswered
                </span>

                <strong className="text-danger">
                  {unanswered}
                </strong>
              </div>

              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  Passing Score
                </span>

                <strong>
                  {PASS_PERCENTAGE}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnicalTest;

