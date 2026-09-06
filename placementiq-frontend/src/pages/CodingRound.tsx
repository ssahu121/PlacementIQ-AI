import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  runCodingCode,
  submitCodingResult,
} from "../api/codingApi";
import "./CodingRound.css";

interface TestCase {
  input: string;
  output: string;
}

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: TestCase[];
  starterCode: {
    java: string;
    python: string;
    javascript: string;
  };
}

interface RunTestCase {
  testCaseNumber: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
}

interface RunResult {
  success: boolean;
  allPassed: boolean;
  message: string;
  testCases: RunTestCase[];
}

const QUESTIONS: CodingQuestion[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an integer array nums and an integer target, return the indices of two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
      },
    ],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums, target):
        # Write your code here
        
        return []`,
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
    return [];
}

module.exports = twoSum;`,
    },
  },

  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string containing brackets, determine whether the brackets are valid and properly closed.",
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    starterCode: {
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
        return false;
    }
}`,
      python: `class Solution:
    def isValid(self, s):
        # Write your code here
        
        return False`,
      javascript: `function isValid(s) {
    // Write your code here
    
    return false;
}

module.exports = isValid;`,
    },
  },
];

const TEST_DURATION = 30 * 60;

function CodingRound() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [language, setLanguage] =
    useState("java");

  const [codes, setCodes] =
    useState<Record<number, string>>({
      1: QUESTIONS[0].starterCode.java,
      2: QUESTIONS[1].starterCode.java,
    });

  const [timeLeft, setTimeLeft] =
    useState(TEST_DURATION);

  const [runResult, setRunResult] =
    useState<RunResult | null>(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [questionResults, setQuestionResults] =
    useState<Record<number, boolean>>({});

  const question =
    QUESTIONS[currentQuestion];

  const currentCode =
    codes[question.id] || "";

  const attempted =
    Object.values(codes).filter(
      (code) =>
        code.trim() !== "" &&
        !code.includes("Write your code here")
    ).length;

  const score = useMemo(() => {
    return Object.values(questionResults)
      .filter(Boolean)
      .length;
  }, [questionResults]);

  const percentage =
    Math.round(
      (score / QUESTIONS.length) * 100
    );

  const passed =
    percentage >= 50;

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (submitted) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            window.clearInterval(timer);
            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [submitted]);

  // =========================================================
  // AUTO SUBMIT WHEN TIME ENDS
  // =========================================================

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !submitted &&
      !isSubmitting
    ) {
      handleSubmit(true);
    }
  }, [timeLeft]);

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const secondsRemaining =
      seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${secondsRemaining
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================================================
  // GET STARTER CODE
  // =========================================================

  const getStarterCodeForLanguage = (
    q: CodingQuestion,
    selectedLanguage: string
  ) => {
    if (
      selectedLanguage === "python"
    ) {
      return q.starterCode.python;
    }

    if (
      selectedLanguage === "javascript"
    ) {
      return q.starterCode.javascript;
    }

    return q.starterCode.java;
  };

  // =========================================================
  // CHANGE LANGUAGE
  // =========================================================

  const changeLanguage = (
    newLanguage: string
  ) => {
    setLanguage(newLanguage);

    setCodes((previous) => {
      const current =
        previous[question.id] || "";

      const isDefaultCode =
        current.includes(
          "Write your code here"
        );

      if (!isDefaultCode) {
        return previous;
      }

      return {
        ...previous,
        [question.id]:
          getStarterCodeForLanguage(
            question,
            newLanguage
          ),
      };
    });

    setRunResult(null);
  };

  // =========================================================
  // UPDATE CODE
  // =========================================================

  const updateCode = (
    value: string
  ) => {
    setCodes((previous) => ({
      ...previous,
      [question.id]: value,
    }));

    setRunResult(null);
  };

  // =========================================================
  // RUN CODE
  // =========================================================

  const runCode = async () => {
    if (
      !currentCode.trim() ||
      currentCode.includes(
        "Write your code here"
      )
    ) {
      alert(
        "Please write your code first."
      );

      return;
    }

    setIsRunning(true);
    setRunResult(null);

    try {
      const response =
        await runCodingCode({
          questionId: question.id,
          language,
          code: currentCode,

          testCases:
            question.examples.map(
              (testCase) => ({
                input:
                  testCase.input,

                expectedOutput:
                  testCase.output,
              })
            ),
        });

      const data =
        response?.data || {};

      // IMPORTANT:
      // Always make testCases an array.
      // This prevents the white-screen error.

      const safeResult: RunResult = {
        success:
          data.success ?? false,

        allPassed:
          data.allPassed ?? false,

        message:
          data.message ??
          "Code execution completed.",

        testCases:
          Array.isArray(
            data.testCases
          )
            ? data.testCases
            : [],
      };

      setRunResult(safeResult);

      // -------------------------------------------------------
      // SAVE QUESTION RESULT
      // -------------------------------------------------------

      setQuestionResults(
        (previous) => ({
          ...previous,
          [question.id]:
            safeResult.allPassed,
        })
      );

    } catch (error) {
      console.error(
        "Code execution failed:",
        error
      );

      setRunResult({
        success: false,
        allPassed: false,
        message:
          "Unable to execute code. Check backend/server.",
        testCases: [],
      });

      setQuestionResults(
        (previous) => ({
          ...previous,
          [question.id]: false,
        })
      );
    } finally {
      setIsRunning(false);
    }
  };

  // =========================================================
  // SUBMIT CODING ROUND
  // =========================================================

  const handleSubmit = async (
    autoSubmit = false
  ) => {
    if (
      submitted ||
      isSubmitting
    ) {
      return;
    }

    if (!autoSubmit) {
      const confirmed =
        window.confirm(
          `You have attempted ${attempted} of ${QUESTIONS.length} questions.\n\nSubmit Coding Round?`
        );

      if (!confirmed) {
        return;
      }
    }

    const userId =
      Number(
        localStorage.getItem(
          "userId"
        )
      );

    if (!userId) {
      alert(
        "User session not found. Please login again."
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await submitCodingResult({
        userId,

        score,

        totalQuestions:
          QUESTIONS.length,

        percentage,

        passed,
      });

      localStorage.setItem(
        "codingResult",
        JSON.stringify({
          score,

          totalQuestions:
            QUESTIONS.length,

          percentage,

          passed,
        })
      );

      if (passed) {
        localStorage.setItem(
          "interviewUnlocked",
          "true"
        );
      } else {
        localStorage.removeItem(
          "interviewUnlocked"
        );
      }

      setSubmitted(true);

    } catch (error) {
      console.error(
        "Coding submission failed:",
        error
      );

      alert(
        "Failed to save coding result."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // RETRY
  // =========================================================

  const retry = () => {
    setCurrentQuestion(0);

    setLanguage("java");

    setCodes({
      1: QUESTIONS[0]
        .starterCode.java,

      2: QUESTIONS[1]
        .starterCode.java,
    });

    setTimeLeft(
      TEST_DURATION
    );

    setRunResult(null);

    setQuestionResults({});

    setSubmitted(false);
  };

  // =========================================================
  // RESULT SCREEN
  // =========================================================

  if (submitted) {
    return (
      <div className="coding-result-page">

        <div className="coding-result-card">

          <div className="result-icon">
            {passed ? "✓" : "!"}
          </div>

          <h1>
            {passed
              ? "Coding Round Passed"
              : "Coding Round Not Cleared"}
          </h1>

          <div className="result-score">
            {score} /{" "}
            {QUESTIONS.length}
          </div>

          <p className="result-percentage">
            {percentage}%
          </p>

          <p className="result-message">
            {passed
              ? "Great job! You have unlocked the AI Mock Interview."
              : "You need at least 1 correct question out of 2 to pass."}
          </p>

          <div className="result-buttons">

            <button
              className="secondary-btn"
              onClick={retry}
            >
              Retry
            </button>

            {passed && (
              <button
                className="primary-btn"
                onClick={() =>
                  navigate(
                    "/ai-interview"
                  )
                }
              >
                Continue to AI Interview →
              </button>
            )}

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }
            >
              Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN CODING PAGE
  // =========================================================

  return (
    <div className="coding-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="coding-header">

        <div className="coding-logo">
          PlacementIQ
          <span> Coding</span>
        </div>

        <div className="coding-title">
          {question.title}
        </div>

        <div
          className={`coding-timer ${
            timeLeft <= 300
              ? "danger"
              : ""
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="coding-main">

        {/* ===================================================
            LEFT QUESTION PANEL
        =================================================== */}

        <aside className="question-panel">

          <div className="question-tabs">

            {QUESTIONS.map(
              (q, index) => (
                <button
                  key={q.id}
                  className={
                    index ===
                    currentQuestion
                      ? "question-tab active"
                      : "question-tab"
                  }
                  onClick={() => {
                    setCurrentQuestion(
                      index
                    );

                    setRunResult(null);
                  }}
                >
                  {index + 1}

                  {questionResults[
                    q.id
                  ] && (
                    <span className="small-check">
                      ✓
                    </span>
                  )}
                </button>
              )
            )}

          </div>

          <div className="question-content">

            <div className="question-heading">

              <h1>
                {question.id}.{" "}
                {question.title}
              </h1>

              <span className="easy-badge">
                {question.difficulty}
              </span>

            </div>

            <p className="question-description">
              {question.description}
            </p>

            <h3>
              Examples
            </h3>

            {question.examples.map(
              (example, index) => (
                <div
                  className="example-box"
                  key={index}
                >

                  <div>
                    <strong>
                      Example{" "}
                      {index + 1}
                    </strong>
                  </div>

                  <pre>
                    Input:{" "}
                    {example.input}
                    {"\n"}
                    Output:{" "}
                    {example.output}
                  </pre>

                </div>
              )
            )}

            <div className="question-info">

              <div>
                <strong>
                  Difficulty
                </strong>

                <span>
                  Easy
                </span>
              </div>

              <div>
                <strong>
                  Questions
                </strong>

                <span>
                  2
                </span>
              </div>

              <div>
                <strong>
                  Passing
                </strong>

                <span>
                  1 / 2
                </span>
              </div>

            </div>

          </div>

        </aside>

        {/* ===================================================
            RIGHT EDITOR
        =================================================== */}

        <section className="editor-panel">

          {/* EDITOR TOPBAR */}

          <div className="editor-topbar">

            <select
              value={language}
              onChange={(e) =>
                changeLanguage(
                  e.target.value
                )
              }
              className="language-select"
            >

              <option value="java">
                Java
              </option>

              <option value="python">
                Python
              </option>

              <option value="javascript">
                JavaScript
              </option>

            </select>

            <span className="editor-label">
              Language
            </span>

          </div>

          {/* CODE EDITOR */}

          <textarea
            className="code-editor"
            value={currentCode}
            onChange={(e) =>
              updateCode(
                e.target.value
              )
            }
            spellCheck={false}
          />

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="editor-actions">

            <button
              className="run-btn"
              onClick={runCode}
              disabled={isRunning}
            >
              {isRunning
                ? "⏳ Running..."
                : "▶ Run Code"}
            </button>

            <button
              className="submit-btn"
              onClick={() =>
                handleSubmit(false)
              }
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit"}
            </button>

          </div>

          {/* =================================================
              TEST PANEL
          ================================================= */}

          <div className="test-panel">

            <div className="test-panel-header">

              <h3>
                Test Cases
              </h3>

              {runResult && (
                <span
                  className={
                    runResult.allPassed
                      ? "all-passed"
                      : "some-failed"
                  }
                >
                  {runResult.allPassed
                    ? "✓ All Passed"
                    : "✕ Failed"}
                </span>
              )}

            </div>

            {/* NO RESULT */}

            {!runResult && (
              <div className="empty-tests">

                <div className="play-icon">
                  ▶
                </div>

                <p>
                  Run your code to test
                  against the examples.
                </p>

              </div>
            )}

            {/* RESULT */}

            {runResult && (
              <div>

                {/* EXECUTION ERROR */}

                {!runResult.success && (
                  <div className="execution-error">

                    <strong>
                      Execution Error
                    </strong>

                    <pre>
                      {runResult.message}
                    </pre>

                  </div>
                )}

                {/* MESSAGE */}

                {runResult.success &&
                  runResult.message && (
                    <div className="run-message">
                      {runResult.message}
                    </div>
                  )}

                {/* TEST CASES */}

                {(
                  runResult.testCases ||
                  []
                ).map(
                  (testCase) => (

                    <div
                      className={
                        testCase.passed
                          ? "test-case passed"
                          : "test-case failed"
                      }
                      key={
                        testCase.testCaseNumber
                      }
                    >

                      <div className="test-case-header">

                        <span>
                          {testCase.passed
                            ? "✓"
                            : "✕"}
                        </span>

                        <strong>
                          Test Case{" "}
                          {
                            testCase.testCaseNumber
                          }
                        </strong>

                        <span>
                          {testCase.passed
                            ? "Passed"
                            : "Failed"}
                        </span>

                      </div>

                      <div className="output-grid">

                        <div>

                          <label>
                            Input
                          </label>

                          <pre>
                            {
                              testCase.input
                            }
                          </pre>

                        </div>

                        <div>

                          <label>
                            Expected
                          </label>

                          <pre>
                            {
                              testCase.expectedOutput
                            }
                          </pre>

                        </div>

                        <div>

                          <label>
                            Your Output
                          </label>

                          <pre>
                            {
                              testCase.actualOutput
                            }
                          </pre>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="coding-footer">

        <button
          className="nav-btn"
          disabled={
            currentQuestion === 0
          }
          onClick={() => {

            setCurrentQuestion(
              (previous) =>
                previous - 1
            );

            setRunResult(null);
          }}
        >
          ← Previous
        </button>

        <div className="footer-status">

          Question{" "}
          {currentQuestion + 1}
          {" / "}
          {QUESTIONS.length}

        </div>

        {currentQuestion <
        QUESTIONS.length - 1 ? (

          <button
            className="nav-btn next"
            onClick={() => {

              setCurrentQuestion(
                (previous) =>
                  previous + 1
              );

              setRunResult(null);
            }}
          >
            Next →
          </button>

        ) : (

          <button
            className="nav-btn submit-final"
            onClick={() =>
              handleSubmit(false)
            }
          >
            Submit Test
          </button>

        )}

      </footer>

    </div>
  );
}

export default CodingRound;