import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AptitudeTest.css";
import { submitAptitudeResult } from "../api/aptitudeApi";

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
    category: "Quantitative Aptitude",
    question: "If 20% of a number is 50, what is the number?",
    options: ["200", "250", "300", "150"],
    answer: 1,
  },
  {
    id: 2,
    category: "Logical Reasoning",
    question: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    answer: 2,
  },
  {
    id: 3,
    category: "Verbal Ability",
    question: "Choose the synonym of 'Rapid'.",
    options: ["Slow", "Quick", "Weak", "Late"],
    answer: 1,
  },
  {
    id: 4,
    category: "Quantitative Aptitude",
    question: "A train travels 120 km in 2 hours. What is its speed?",
    options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
    answer: 2,
  },
  {
    id: 5,
    category: "Logical Reasoning",
    question: "If CAT is coded as DBU, how is DOG coded?",
    options: ["EPH", "EOH", "FPH", "DPG"],
    answer: 0,
  },
  {
    id: 6,
    category: "Quantitative Aptitude",
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    answer: 2,
  },
  {
    id: 7,
    category: "Verbal Ability",
    question: "Choose the antonym of 'Ancient'.",
    options: ["Old", "Modern", "Historic", "Past"],
    answer: 1,
  },
  {
    id: 8,
    category: "Logical Reasoning",
    question: "Which number does not belong to the group?",
    options: ["9", "16", "25", "35"],
    answer: 3,
  },
  {
    id: 9,
    category: "Quantitative Aptitude",
    question:
      "If the cost price is ₹500 and selling price is ₹600, what is the profit percentage?",
    options: ["10%", "15%", "20%", "25%"],
    answer: 2,
  },
  {
    id: 10,
    category: "Verbal Ability",
    question: "Choose the correctly spelled word.",
    options: ["Occassion", "Ocassion", "Occasion", "Occassionn"],
    answer: 2,
  },
  {
    id: 11,
    category: "Quantitative Aptitude",
    question: "What is the average of 10, 20 and 30?",
    options: ["15", "20", "25", "30"],
    answer: 1,
  },
  {
    id: 12,
    category: "Logical Reasoning",
    question: "Book is to Reading as Fork is to:",
    options: ["Writing", "Eating", "Cooking", "Drawing"],
    answer: 1,
  },
  {
    id: 13,
    category: "Quantitative Aptitude",
    question: "What is 12 × 8?",
    options: ["86", "96", "108", "88"],
    answer: 1,
  },
  {
    id: 14,
    category: "Verbal Ability",
    question: "Choose the correct sentence.",
    options: [
      "He go to college.",
      "He going to college.",
      "He goes to college.",
      "He gone to college.",
    ],
    answer: 2,
  },
  {
    id: 15,
    category: "Logical Reasoning",
    question:
      "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: [
      "All roses are red.",
      "Some roses are red.",
      "All roses are flowers.",
      "No flowers are roses.",
    ],
    answer: 2,
  },
  {
    id: 16,
    category: "Quantitative Aptitude",
    question:
      "A product marked ₹1000 is sold at 10% discount. What is the selling price?",
    options: ["₹850", "₹900", "₹950", "₹990"],
    answer: 1,
  },
  {
    id: 17,
    category: "Verbal Ability",
    question: "What is the plural of 'Child'?",
    options: ["Childs", "Childes", "Children", "Childrens"],
    answer: 2,
  },
  {
    id: 18,
    category: "Logical Reasoning",
    question: "Find the odd one out.",
    options: ["Apple", "Mango", "Carrot", "Banana"],
    answer: 2,
  },
  {
    id: 19,
    category: "Quantitative Aptitude",
    question:
      "If 5 workers complete a job in 10 days, how many worker-days are required?",
    options: ["15", "40", "50", "60"],
    answer: 2,
  },
  {
    id: 20,
    category: "Logical Reasoning",
    question: "Complete the sequence: A, C, E, G, ?",
    options: ["H", "I", "J", "K"],
    answer: 1,
  },
];

const TEST_DURATION = 20 * 60;
const PASS_PERCENTAGE = 60;

function AptitudeTest() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return QUESTIONS.reduce((total, question) => {
      return total + (answers[question.id] === question.answer ? 1 : 0);
    }, 0);
  }, [answers]);

  const percentage = Math.round((score / QUESTIONS.length) * 100);
  const passed = percentage >= PASS_PERCENTAGE;

  const attempted = Object.keys(answers).length;
  const unanswered = QUESTIONS.length - attempted;

  useEffect(() => {
    if (!started || submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  useEffect(() => {
    if (submitted) {
      localStorage.setItem(
        "aptitudeResult",
        JSON.stringify({
          score,
          total: QUESTIONS.length,
          percentage,
          passed,
        }),
      );

      if (passed) {
        localStorage.setItem("technicalUnlocked", "true");
      }
    }
  }, [submitted, score, percentage, passed]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const selectAnswer = (optionIndex: number) => {
    setAnswers((previous) => ({
      ...previous,
      [QUESTIONS[currentQuestion].id]: optionIndex,
    }));
  };

  const toggleMark = () => {
    const id = QUESTIONS[currentQuestion].id;

    setMarked((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const submitTest = async () => {
    const confirmed = window.confirm(
      `You have attempted ${attempted} of ${QUESTIONS.length} questions.\n\nAre you sure you want to submit the test?`,
    );

    if (!confirmed) {
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    if (!userId) {
      alert("User session not found. Please login again.");
      return;
    }

    try {
      await submitAptitudeResult({
        userId: userId,
        score: score,
        totalQuestions: QUESTIONS.length,
        percentage: percentage,
        passed: passed,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Aptitude result submission failed:", error);
      alert("Failed to save your result. Please try again.");
    }
  };

  const retryTest = () => {
    setAnswers({});
    setMarked([]);
    setCurrentQuestion(0);
    setTimeLeft(TEST_DURATION);
    setSubmitted(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="aptitude-page">
        <div className="aptitude-topbar">
          <div className="brand">
            <div className="brand-icon">
              <i className="bi bi-stars"></i>
            </div>
            <div>
              <strong>PlacementIQ</strong>
              <small>AI Placement Preparation</small>
            </div>
          </div>

          <button
            className="back-dashboard"
            onClick={() => navigate("/student/dashboard")}
          >
            <i className="bi bi-arrow-left"></i>
            Dashboard
          </button>
        </div>

        <main className="aptitude-intro">
          <div className="intro-badge">
            <i className="bi bi-1-circle-fill"></i>
            ROUND 1
          </div>

          <h1>Aptitude Assessment</h1>

          <p className="intro-text">
            Test your quantitative, logical and verbal reasoning skills. Clear
            this round to unlock the Technical Assessment.
          </p>

          <div className="test-info-grid">
            <div className="info-card">
              <div className="info-icon purple">
                <i className="bi bi-question-circle"></i>
              </div>
              <div>
                <span>Questions</span>
                <strong>20 MCQs</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon blue">
                <i className="bi bi-stopwatch"></i>
              </div>
              <div>
                <span>Duration</span>
                <strong>20 Minutes</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon green">
                <i className="bi bi-check2-circle"></i>
              </div>
              <div>
                <span>Pass Criteria</span>
                <strong>60%</strong>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon orange">
                <i className="bi bi-trophy"></i>
              </div>
              <div>
                <span>Next Round</span>
                <strong>Technical</strong>
              </div>
            </div>
          </div>

          <div className="rules-card">
            <div className="rules-heading">
              <i className="bi bi-shield-check"></i>
              <div>
                <h3>Before you begin</h3>
                <p>Make sure you're ready for the assessment.</p>
              </div>
            </div>

            <div className="rules-list">
              <div>
                <i className="bi bi-check-circle-fill"></i>
                Each question has only one correct answer.
              </div>
              <div>
                <i className="bi bi-check-circle-fill"></i>
                You can move between questions anytime.
              </div>
              <div>
                <i className="bi bi-check-circle-fill"></i>
                You can mark questions for review.
              </div>
              <div>
                <i className="bi bi-check-circle-fill"></i>
                Test will auto-submit when the timer ends.
              </div>
            </div>
          </div>

          <button className="start-test-btn" onClick={() => setStarted(true)}>
            Start Aptitude Test
            <i className="bi bi-arrow-right"></i>
          </button>
        </main>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="aptitude-page result-page">
        <div className="result-card">
          <div className={`result-icon ${passed ? "success" : "failed"}`}>
            <i
              className={`bi ${passed ? "bi-trophy-fill" : "bi-arrow-repeat"}`}
            ></i>
          </div>

          <span className={`result-status ${passed ? "passed" : "failed"}`}>
            {passed ? "ROUND CLEARED" : "ROUND NOT CLEARED"}
          </span>

          <h1>
            {passed
              ? "Excellent! You cleared Aptitude."
              : "Almost there! Keep practicing."}
          </h1>

          <p>
            {passed
              ? "Your Technical Assessment is now unlocked."
              : `You need at least ${PASS_PERCENTAGE}% to unlock the next round.`}
          </p>

          <div className="score-circle">
            <strong>{percentage}%</strong>
            <span>Score</span>
          </div>

          <div className="result-stats">
            <div>
              <span>Correct</span>
              <strong>{score}</strong>
            </div>
            <div>
              <span>Wrong</span>
              <strong>{attempted - score}</strong>
            </div>
            <div>
              <span>Skipped</span>
              <strong>{unanswered}</strong>
            </div>
            <div>
              <span>Required</span>
              <strong>{PASS_PERCENTAGE}%</strong>
            </div>
          </div>

          <div className="result-actions">
            {passed ? (
              <button
                className="start-test-btn"
                onClick={() => navigate("/technical-test")}
              >
                Continue to Technical Round
                <i className="bi bi-arrow-right"></i>
              </button>
            ) : (
              <button className="start-test-btn" onClick={retryTest}>
                Try Aptitude Again
                <i className="bi bi-arrow-repeat"></i>
              </button>
            )}

            <button
              className="secondary-btn"
              onClick={() => navigate("/student/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const selectedAnswer = answers[question.id];
  const isMarked = marked.includes(question.id);

  return (
    <div className="test-page">
      <header className="test-header">
        <div className="brand">
          <div className="brand-icon">
            <i className="bi bi-stars"></i>
          </div>
          <div>
            <strong>PlacementIQ</strong>
            <small>Aptitude Assessment</small>
          </div>
        </div>

        <div className={`timer ${timeLeft <= 120 ? "danger" : ""}`}>
          <i className="bi bi-stopwatch"></i>
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="test-progress">
        <div
          style={{
            width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`,
          }}
        ></div>
      </div>

      <main className="test-layout">
        <section className="question-section">
          <div className="question-top">
            <span className="question-number">
              Question {currentQuestion + 1} / {QUESTIONS.length}
            </span>

            <span className="category-badge">{question.category}</span>
          </div>

          <div className="question-card">
            <h2>{question.question}</h2>

            <div className="options">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  className={`option ${
                    selectedAnswer === index ? "selected" : ""
                  }`}
                  onClick={() => selectAnswer(index)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>

                  {selectedAnswer === index && (
                    <i className="bi bi-check-circle-fill"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="question-actions">
            <button className="review-btn" onClick={toggleMark}>
              <i
                className={`bi ${
                  isMarked ? "bi-bookmark-fill" : "bi-bookmark"
                }`}
              ></i>

              {isMarked ? "Marked" : "Mark for Review"}
            </button>

            <div className="navigation-buttons">
              <button
                className="secondary-btn"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((previous) => previous - 1)}
              >
                <i className="bi bi-arrow-left"></i>
                Previous
              </button>

              {currentQuestion === QUESTIONS.length - 1 ? (
                <button className="submit-btn" onClick={submitTest}>
                  Submit Test
                  <i className="bi bi-check2"></i>
                </button>
              ) : (
                <button
                  className="next-btn"
                  onClick={() => setCurrentQuestion((previous) => previous + 1)}
                >
                  Next
                  <i className="bi bi-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="question-sidebar">
          <div className="sidebar-card">
            <h3>Test Overview</h3>

            <div className="overview-stats">
              <div>
                <strong>{attempted}</strong>
                <span>Answered</span>
              </div>

              <div>
                <strong>{unanswered}</strong>
                <span>Remaining</span>
              </div>
            </div>

            <div className="palette-title">
              <span>Questions</span>
              <small>{marked.length} marked</small>
            </div>

            <div className="question-palette">
              {QUESTIONS.map((item, index) => (
                <button
                  key={item.id}
                  className={`
                    ${currentQuestion === index ? "active" : ""}
                    ${answers[item.id] !== undefined ? "answered" : ""}
                    ${marked.includes(item.id) ? "marked" : ""}
                  `}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="legend">
              <span>
                <i className="answered-dot"></i>
                Answered
              </span>

              <span>
                <i className="marked-dot"></i>
                Review
              </span>

              <span>
                <i className="empty-dot"></i>
                Not visited
              </span>
            </div>

            <button className="finish-btn" onClick={submitTest}>
              Finish & Submit
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default AptitudeTest;
