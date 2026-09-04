import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCodingResult } from "../api/codingApi";

interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  input: string;
  output: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

const QUESTIONS: CodingQuestion[] = [
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a program to reverse the given string.",
    input: "hello",
    output: "olleh",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "java", output: "avaj" },
    ],
  },
  {
    id: 2,
    title: "Check Palindrome",
    description: "Check whether the given string is a palindrome.",
    input: "madam",
    output: "true",
    testCases: [
      { input: "madam", output: "true" },
      { input: "hello", output: "false" },
    ],
  },
  {
    id: 3,
    title: "Find Maximum Number",
    description: "Find the maximum element from an integer array.",
    input: "[10, 25, 7, 40, 15]",
    output: "40",
    testCases: [
      { input: "[10,25,7,40,15]", output: "40" },
      { input: "[5,2,9,1]", output: "9" },
    ],
  },
  {
    id: 4,
    title: "Find Minimum Number",
    description: "Find the minimum element from an integer array.",
    input: "[10, 25, 7, 40, 15]",
    output: "7",
    testCases: [
      { input: "[10,25,7,40,15]", output: "7" },
      { input: "[5,2,9,1]", output: "1" },
    ],
  },
  {
    id: 5,
    title: "Sum of Array",
    description: "Calculate the sum of all elements in an integer array.",
    input: "[1, 2, 3, 4, 5]",
    output: "15",
    testCases: [
      { input: "[1,2,3,4,5]", output: "15" },
      { input: "[10,20,30]", output: "60" },
    ],
  },
  {
    id: 6,
    title: "Count Vowels",
    description: "Count the number of vowels in the given string.",
    input: "placement",
    output: "3",
    testCases: [
      { input: "placement", output: "3" },
      { input: "hello", output: "2" },
    ],
  },
  {
    id: 7,
    title: "Factorial",
    description: "Find the factorial of a given positive integer.",
    input: "5",
    output: "120",
    testCases: [
      { input: "5", output: "120" },
      { input: "6", output: "720" },
    ],
  },
  {
    id: 8,
    title: "Fibonacci Series",
    description: "Print the first N Fibonacci numbers.",
    input: "5",
    output: "0 1 1 2 3",
    testCases: [
      { input: "5", output: "0 1 1 2 3" },
      { input: "7", output: "0 1 1 2 3 5 8" },
    ],
  },
  {
    id: 9,
    title: "Prime Number",
    description: "Check whether a given number is prime.",
    input: "17",
    output: "true",
    testCases: [
      { input: "17", output: "true" },
      { input: "20", output: "false" },
    ],
  },
  {
    id: 10,
    title: "Even or Odd",
    description: "Check whether the given number is even or odd.",
    input: "12",
    output: "even",
    testCases: [
      { input: "12", output: "even" },
      { input: "7", output: "odd" },
    ],
  },
  {
    id: 11,
    title: "Count Digits",
    description: "Count the number of digits in a positive integer.",
    input: "12345",
    output: "5",
    testCases: [
      { input: "12345", output: "5" },
      { input: "987", output: "3" },
    ],
  },
  {
    id: 12,
    title: "Reverse Number",
    description: "Reverse the digits of a given number.",
    input: "12345",
    output: "54321",
    testCases: [
      { input: "12345", output: "54321" },
      { input: "120", output: "21" },
    ],
  },
  {
    id: 13,
    title: "Second Largest",
    description: "Find the second largest element in an integer array.",
    input: "[10, 5, 20, 8, 15]",
    output: "15",
    testCases: [
      { input: "[10,5,20,8,15]", output: "15" },
      { input: "[5,1,9,7]", output: "7" },
    ],
  },
  {
    id: 14,
    title: "Remove Duplicates",
    description: "Remove duplicate values from an integer array.",
    input: "[1,2,2,3,3,4]",
    output: "[1,2,3,4]",
    testCases: [
      { input: "[1,2,2,3,3,4]", output: "[1,2,3,4]" },
      { input: "[5,5,6,7,7]", output: "[5,6,7]" },
    ],
  },
  {
    id: 15,
    title: "Character Frequency",
    description: "Find the frequency of a given character in a string.",
    input: "programming, m",
    output: "2",
    testCases: [
      { input: "programming, m", output: "2" },
      { input: "hello, l", output: "2" },
    ],
  },
  {
    id: 16,
    title: "Anagram Check",
    description: "Check whether two strings are anagrams.",
    input: "listen, silent",
    output: "true",
    testCases: [
      { input: "listen, silent", output: "true" },
      { input: "hello, world", output: "false" },
    ],
  },
  {
    id: 17,
    title: "Binary Search",
    description: "Search for a target element in a sorted integer array.",
    input: "[1,3,5,7,9], target=7",
    output: "3",
    testCases: [
      { input: "[1,3,5,7,9], target=7", output: "3" },
      { input: "[2,4,6,8], target=5", output: "-1" },
    ],
  },
  {
    id: 18,
    title: "Array Rotation",
    description: "Rotate an array to the right by one position.",
    input: "[1,2,3,4,5]",
    output: "[5,1,2,3,4]",
    testCases: [
      { input: "[1,2,3,4,5]", output: "[5,1,2,3,4]" },
      { input: "[10,20,30]", output: "[30,10,20]" },
    ],
  },
  {
    id: 19,
    title: "GCD of Two Numbers",
    description: "Find the greatest common divisor of two numbers.",
    input: "48, 18",
    output: "6",
    testCases: [
      { input: "48,18", output: "6" },
      { input: "20,30", output: "10" },
    ],
  },
  {
    id: 20,
    title: "Missing Number",
    description:
      "Find the missing number from an array containing numbers from 1 to N.",
    input: "[1,2,3,5,6]",
    output: "4",
    testCases: [
      { input: "[1,2,3,5,6]", output: "4" },
      { input: "[1,2,4,5]", output: "3" },
    ],
  },
];

const TEST_DURATION = 30 * 60;
const PASS_PERCENTAGE = 60;

function CodingRound() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const attempted = Object.keys(answers).length;

  const percentage = useMemo(() => {
    return Math.round((score / QUESTIONS.length) * 100);
  }, [score]);

  useEffect(() => {
    if (submitted) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleCodeChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const toggleMark = () => {
    setMarked((prev) =>
      prev.includes(question.id)
        ? prev.filter((id) => id !== question.id)
        : [...prev, question.id]
    );
  };

  const evaluateAnswer = (answer: string, q: CodingQuestion) => {
    if (!answer.trim()) {
      return false;
    }

    const normalizedAnswer = answer
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/;/g, "");

    const keywords: Record<number, string[]> = {
      1: ["reverse"],
      2: ["palindrome"],
      3: ["max", "maximum"],
      4: ["min", "minimum"],
      5: ["sum"],
      6: ["vowel"],
      7: ["factorial"],
      8: ["fibonacci"],
      9: ["prime"],
      10: ["even", "odd"],
      11: ["digit"],
      12: ["reverse"],
      13: ["secondlargest"],
      14: ["duplicate"],
      15: ["frequency", "count"],
      16: ["anagram"],
      17: ["binarysearch"],
      18: ["rotate", "rotation"],
      19: ["gcd", "greatestcommon"],
      20: ["missing"],
    };

    const matchedKeyword = keywords[q.id]?.some((keyword) =>
      normalizedAnswer.includes(keyword)
    );

    return Boolean(matchedKeyword);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitted) {
      return;
    }

    if (!autoSubmit) {
      const confirmed = window.confirm(
        `You have attempted ${attempted} of ${QUESTIONS.length} questions.\n\nAre you sure you want to submit the Coding Round?`
      );

      if (!confirmed) {
        return;
      }
    }

    let calculatedScore = 0;

    QUESTIONS.forEach((q) => {
      if (evaluateAnswer(answers[q.id] || "", q)) {
        calculatedScore++;
      }
    });

    const calculatedPercentage = Math.round(
      (calculatedScore / QUESTIONS.length) * 100
    );

    const calculatedPassed = calculatedPercentage >= PASS_PERCENTAGE;

    const userId = Number(localStorage.getItem("userId"));

    if (!userId) {
      alert("User session not found. Please login again.");
      return;
    }

    try {
      await submitCodingResult({
        userId,
        score: calculatedScore,
        totalQuestions: QUESTIONS.length,
        percentage: calculatedPercentage,
        passed: calculatedPassed,
      });

      setScore(calculatedScore);
      setPassed(calculatedPassed);
      setSubmitted(true);

      localStorage.setItem(
        "codingResult",
        JSON.stringify({
          score: calculatedScore,
          totalQuestions: QUESTIONS.length,
          percentage: calculatedPercentage,
          passed: calculatedPassed,
        })
      );

      if (calculatedPassed) {
        localStorage.setItem("aiInterviewUnlocked", "true");
      }
    } catch (error) {
      console.error("Coding result submission failed:", error);
      alert("Failed to save your Coding result. Please try again.");
    }
  };

  const retryTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setMarked([]);
    setTimeLeft(TEST_DURATION);
    setSubmitted(false);
    setScore(0);
    setPassed(false);
  };

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="card shadow-lg border-0">
          <div className="card-body text-center p-5">
            <div className="mb-4">
              <i
                className={`bi ${
                  passed
                    ? "bi-check-circle-fill text-success"
                    : "bi-x-circle-fill text-danger"
                }`}
                style={{ fontSize: "70px" }}
              ></i>
            </div>

            <h2 className="fw-bold mb-3">Coding Round Result</h2>

            <h1 className="display-4 fw-bold mb-3">
              {score}/{QUESTIONS.length}
            </h1>

            <h4 className="mb-4">
              Score: {percentage}%
            </h4>

            {passed ? (
              <>
                <div className="alert alert-success">
                  <strong>Congratulations!</strong>
                  <br />
                  You passed the Coding Round.
                  <br />
                  AI Interview is now unlocked.
                </div>

                <button
                  className="btn btn-success px-4"
                  onClick={() => navigate("/ai-interview")}
                >
                  Continue to AI Interview
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </>
            ) : (
              <>
                <div className="alert alert-danger">
                  <strong>Not Passed</strong>
                  <br />
                  You need at least {PASS_PERCENTAGE}% to unlock the AI
                  Interview.
                </div>

                <button
                  className="btn btn-primary px-4"
                  onClick={retryTest}
                >
                  Retry Coding Round
                  <i className="bi bi-arrow-repeat ms-2"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Coding Round</h2>
            <p className="text-muted mb-0">
              Solve the coding problems and submit your solutions.
            </p>
          </div>

          <div className="text-end">
            <div className="text-muted small">Time Remaining</div>
            <h4 className="fw-bold text-danger mb-0">
              <i className="bi bi-clock me-2"></i>
              {formatTime(timeLeft)}
            </h4>
          </div>
        </div>

        {/* Progress */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold">
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </span>

              <span className="text-muted">
                Attempted {attempted}/{QUESTIONS.length}
              </span>
            </div>

            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${
                    ((currentQuestion + 1) / QUESTIONS.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Question */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-primary mb-2">
                      Problem {question.id}
                    </span>

                    <h4 className="fw-bold">{question.title}</h4>
                  </div>

                  <button
                    className={`btn ${
                      marked.includes(question.id)
                        ? "btn-warning"
                        : "btn-outline-warning"
                    }`}
                    onClick={toggleMark}
                  >
                    <i className="bi bi-bookmark me-1"></i>
                    {marked.includes(question.id)
                      ? "Marked"
                      : "Mark"}
                  </button>
                </div>

                <p className="mb-4">{question.description}</p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <h6 className="fw-bold">Sample Input</h6>
                      <code>{question.input}</code>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="bg-light rounded p-3">
                      <h6 className="fw-bold">Expected Output</h6>
                      <code>{question.output}</code>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">
                  Write Your Solution
                </h6>

                <textarea
                  className="form-control"
                  rows={14}
                  value={answers[question.id] || ""}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder={`// Write your solution here...

Example:
public static void main(String[] args) {
    // your code
}`}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    backgroundColor: "#111827",
                    color: "#f9fafb",
                  }}
                />

                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={currentQuestion === 0}
                    onClick={() =>
                      setCurrentQuestion((prev) => prev - 1)
                    }
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Previous
                  </button>

                  {currentQuestion < QUESTIONS.length - 1 ? (
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setCurrentQuestion((prev) => prev + 1)
                      }
                    >
                      Next
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => handleSubmit()}
                    >
                      Submit Coding Round
                      <i className="bi bi-check-lg ms-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Question Palette</h5>

                <div className="d-flex flex-wrap gap-2">
                  {QUESTIONS.map((q, index) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isMarked = marked.includes(q.id);
                    const isCurrent = index === currentQuestion;

                    return (
                      <button
                        key={q.id}
                        className={`btn ${
                          isCurrent
                            ? "btn-primary"
                            : isAnswered
                            ? "btn-success"
                            : isMarked
                            ? "btn-warning"
                            : "btn-outline-secondary"
                        }`}
                        style={{
                          width: "44px",
                          height: "44px",
                        }}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <hr />

                <div className="small">
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">
                      &nbsp;
                    </span>
                    Current
                  </div>

                  <div className="mb-2">
                    <span className="badge bg-success me-2">
                      &nbsp;
                    </span>
                    Answered
                  </div>

                  <div className="mb-2">
                    <span className="badge bg-warning me-2">
                      &nbsp;
                    </span>
                    Marked
                  </div>

                  <div>
                    <span className="badge bg-secondary me-2">
                      &nbsp;
                    </span>
                    Not Attempted
                  </div>
                </div>

                <hr />

                <div className="alert alert-info mb-0">
                  <strong>Passing Criteria:</strong>
                  <br />
                  Minimum {PASS_PERCENTAGE}% required to unlock the
                  AI Interview.
                </div>
              </div>
            </div>

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={() => handleSubmit()}
            >
              <i className="bi bi-send me-2"></i>
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodingRound;