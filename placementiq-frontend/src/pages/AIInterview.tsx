import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIInterview.css";

const QUESTIONS = [
  "Tell me about yourself and your technical background.",
  "Explain the difference between an ArrayList and a LinkedList in Java.",
  "What is REST API and how does it work?",
  "Explain one project that you have worked on and your contribution to it.",
  "How would you debug a problem when your code is not producing the expected output?",
];

function HumanAIInterviewer({
  speaking,
}: {
  speaking: boolean;
}) {
  return (
    <div className="ai-interviewer-wrapper">
      <div className={`ai-interviewer ${speaking ? "speaking" : ""}`}>

        {/* Hair */}
        <div className="ai-hair"></div>

        {/* Head */}
        <div className="ai-head">

          {/* Ears */}
          <div className="ai-ear ai-ear-left"></div>
          <div className="ai-ear ai-ear-right"></div>

          {/* Face */}
          <div className="ai-face">

            {/* Eyebrows */}
            <div className="ai-eyebrows">
              <span></span>
              <span></span>
            </div>

            {/* Eyes */}
            <div className="ai-eyes">
              <div className="ai-eye">
                <span></span>
              </div>

              <div className="ai-eye">
                <span></span>
              </div>
            </div>

            {/* Nose */}
            <div className="ai-nose"></div>

            {/* Mouth */}
            <div
              className={`ai-mouth ${
                speaking ? "ai-mouth-speaking" : ""
              }`}
            >
              <span></span>
            </div>

            {/* Jaw */}
            <div className="ai-jaw"></div>

          </div>
        </div>

        {/* Neck */}
        <div className="ai-neck"></div>

        {/* Body */}
        <div className="ai-body">

          {/* Shirt */}
          <div className="ai-shirt">
            <div className="ai-collar-left"></div>
            <div className="ai-collar-right"></div>
          </div>

          {/* Tie */}
          <div className="ai-tie"></div>

        </div>
      </div>

      <div className="ai-speaking-status">
        <span
          className={
            speaking ? "ai-status-dot speaking-dot" : "ai-status-dot"
          }
        ></span>

        {speaking
          ? "AI Interviewer is speaking..."
          : "AI Interviewer"}
      </div>
    </div>
  );
}

function AIInterview() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  const [permissionError, setPermissionError] =
    useState("");

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [interviewFinished, setInterviewFinished] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(10 * 60);

  const [isRecording, setIsRecording] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [recordedAnswers, setRecordedAnswers] =
    useState<Blob[]>([]);

  /* -----------------------------------------
     START CAMERA + MICROPHONE
  ----------------------------------------- */

const startCameraAndMic = async () => {
  try {
    setPermissionError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionError(
        "Camera browser me supported nahi hai."
      );
      return;
    }

    // Stop any old stream before starting a new one.
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: true,
    });

    streamRef.current = stream;

    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    setCameraOn(videoTracks.length > 0);
    setMicOn(audioTracks.length > 0);

    // Open the interview screen after permission is granted.
    setInterviewStarted(true);

    // Attach immediately when the video element already exists.
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      try {
        await videoRef.current.play();
      } catch (error) {
        console.error("Video play error:", error);
      }
    }
  } catch (error) {
    console.error("Camera/Mic Error:", error);

    setCameraOn(false);
    setMicOn(false);

    setPermissionError(
      "Camera/Microphone access nahi mila. Browser me Allow karo."
    );
  }
};

const toggleCamera = async () => {
  if (cameraOn) {
    const videoTracks = streamRef.current?.getVideoTracks() || [];

    videoTracks.forEach((track) => {
      track.stop();
    });

    setCameraOn(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    return;
  }

  try {
    setPermissionError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionError("Camera browser me supported nahi hai.");
      return;
    }

    const newVideoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
    });

    const newVideoTrack = newVideoStream.getVideoTracks()[0];

    if (!newVideoTrack) {
      throw new Error("Camera track nahi mila.");
    }

    if (streamRef.current) {
      streamRef.current.addTrack(newVideoTrack);
    } else {
      streamRef.current = newVideoStream;
    }

    setCameraOn(true);

    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      try {
        await videoRef.current.play();
      } catch (error) {
        console.error("Video play error:", error);
      }
    }
  } catch (error) {
    console.error("Camera Error:", error);
    setCameraOn(false);
    setPermissionError(
      "Camera access nahi mila. Browser me Allow karo."
    );
  }
};

  /* -----------------------------------------
     ATTACH CAMERA STREAM TO VIDEO ELEMENT
  ----------------------------------------- */

  useEffect(() => {
    if (!interviewStarted) return;

    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    video.play().catch((error) => {
      console.error("Video play error:", error);
    });

    return () => {
      if (video.srcObject === stream) {
        video.srcObject = null;
      }
    };
  }, [interviewStarted]);

  /* -----------------------------------------
     SPEAK QUESTION
  ----------------------------------------- */

  const speakQuestion = () => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        QUESTIONS[currentQuestion]
      );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    /*
     * Try to select a natural English voice.
     */
    const voices =
      window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((voice) =>
        voice.name.toLowerCase().includes("google")
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (preferredVoice) {
      speech.voice = preferredVoice;
    }

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  /* -----------------------------------------
     TIMER
  ----------------------------------------- */

  useEffect(() => {
    if (
      !interviewStarted ||
      interviewFinished ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          finishInterview();
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    interviewStarted,
    interviewFinished,
    timeLeft,
  ]);

  /* -----------------------------------------
     TIMER FORMAT
  ----------------------------------------- */

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  /* -----------------------------------------
     START RECORDING
  ----------------------------------------- */

  const startRecording = () => {
    const stream = streamRef.current;

    if (!stream) {
      return;
    }

    const audioTracks =
      stream.getAudioTracks();

    if (audioTracks.length === 0) {
      setPermissionError(
        "Microphone is not available."
      );
      return;
    }

    try {
      const audioStream =
        new MediaStream(audioTracks);

      const recorder =
        new MediaRecorder(audioStream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const audioBlob =
          new Blob(
            audioChunksRef.current,
            {
              type: "audio/webm",
            }
          );

        setRecordedAnswers((previous) => [
          ...previous,
          audioBlob,
        ]);
      };

      recorder.start();

      mediaRecorderRef.current =
        recorder;

      setIsRecording(true);
    } catch (error) {
      console.error(error);

      setPermissionError(
        "Unable to start audio recording."
      );
    }
  };

  /* -----------------------------------------
     STOP RECORDING
  ----------------------------------------- */

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }

    mediaRecorderRef.current = null;

    setIsRecording(false);
  };

  /* -----------------------------------------
     NEXT QUESTION
  ----------------------------------------- */

  const nextQuestion = () => {
    stopRecording();

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    if (
      currentQuestion <
      QUESTIONS.length - 1
    ) {
      const next =
        currentQuestion + 1;

      setCurrentQuestion(next);

      setTimeout(() => {
        speakQuestionForQuestion(next);
      }, 500);
    }
  };

  /* -----------------------------------------
     SPEAK SPECIFIC QUESTION
  ----------------------------------------- */

  const speakQuestionForQuestion = (
    questionIndex: number
  ) => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        QUESTIONS[questionIndex]
      );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((voice) =>
        voice.name.toLowerCase().includes("google")
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (preferredVoice) {
      speech.voice = preferredVoice;
    }

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      speech
    );
  };

  /* -----------------------------------------
     PREVIOUS QUESTION
  ----------------------------------------- */

  const previousQuestion = () => {
    stopRecording();

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    if (currentQuestion > 0) {
      const previous =
        currentQuestion - 1;

      setCurrentQuestion(previous);

      setTimeout(() => {
        speakQuestionForQuestion(
          previous
        );
      }, 500);
    }
  };

  /* -----------------------------------------
     FINISH INTERVIEW
  ----------------------------------------- */

  const finishInterview = () => {
    stopRecording();

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    streamRef.current = null;

    setCameraOn(false);
    setMicOn(false);
    setInterviewFinished(true);
  };

  /* -----------------------------------------
     CLEANUP
  ----------------------------------------- */

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  /* -----------------------------------------
     RETRY INTERVIEW
  ----------------------------------------- */

  const retryInterview = () => {
    setCurrentQuestion(0);
    setTimeLeft(10 * 60);
    setInterviewFinished(false);
    setInterviewStarted(false);
    setRecordedAnswers([]);
    setIsRecording(false);
    setIsSpeaking(false);
    setPermissionError("");

    window.speechSynthesis.cancel();

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setCameraOn(false);
    setMicOn(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /* -----------------------------------------
     START SCREEN
  ----------------------------------------- */

  if (!interviewStarted) {
    return (
      <div className="ai-page">

        <div className="ai-start-card">

          <div className="ai-start-left">

            <div className="ai-badge">
              <span>●</span> AI POWERED
            </div>

            <h1>
              AI Mock Interview
            </h1>

            <p className="ai-start-description">
              Practice your placement interview
              with a realistic AI interviewer.
              The interviewer will ask technical
              questions and speak them aloud.
            </p>

            <div className="ai-features">

              <div className="ai-feature">
                <span>🎥</span>
                <div>
                  <strong>Camera Interview</strong>
                  <small>
                    Live camera monitoring
                  </small>
                </div>
              </div>

              <div className="ai-feature">
                <span>🎙️</span>
                <div>
                  <strong>Voice Answers</strong>
                  <small>
                    Answer using your microphone
                  </small>
                </div>
              </div>

              <div className="ai-feature">
                <span>🤖</span>
                <div>
                  <strong>AI Interviewer</strong>
                  <small>
                    AI asks and speaks questions
                  </small>
                </div>
              </div>

            </div>

            {permissionError && (
              <div className="ai-error">
                {permissionError}
              </div>
            )}

            <button
              className="ai-start-button"
              onClick={startCameraAndMic}
            >
              <span>Start AI Interview</span>
              <span>→</span>
            </button>

            <p className="ai-privacy">
              🔒 Your camera and microphone are
              used only during the interview.
            </p>

          </div>

          <div className="ai-start-right">

            <HumanAIInterviewer
              speaking={false}
            />

            <div className="ai-ready-card">
              <span className="ready-dot"></span>
              AI Interviewer Ready
            </div>

          </div>

        </div>

      </div>
    );
  }

  /* -----------------------------------------
     FINISHED SCREEN
  ----------------------------------------- */

  if (interviewFinished) {
    return (
      <div className="ai-page">

        <div className="ai-finished-card">

          <div className="finished-icon">
            ✓
          </div>

          <h1>
            Interview Completed
          </h1>

          <p>
            Great job! Your AI mock interview
            has been completed successfully.
          </p>

          <div className="finished-stats">

            <div>
              <strong>
                {QUESTIONS.length}
              </strong>
              <span>
                Questions
              </span>
            </div>

            <div>
              <strong>
                {formatTime(
                  10 * 60 - timeLeft
                )}
              </strong>
              <span>
                Interview Time
              </span>
            </div>

            <div>
              <strong>
                {recordedAnswers.length}
              </strong>
              <span>
                Answers Recorded
              </span>
            </div>

          </div>

          <div className="ai-finished-info">
            <span>🤖</span>
            <div>
              <strong>
                AI Evaluation
              </strong>
              <p>
                Your interview responses can
                now be evaluated by the AI
                interviewer.
              </p>
            </div>
          </div>

          <div className="finished-buttons">

            <button
              className="retry-button"
              onClick={retryInterview}
            >
              Retry Interview
            </button>

            <button
              className="dashboard-button"
              onClick={() =>
                navigate(
                  "/student/dashboard"
                )
              }
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* -----------------------------------------
     MAIN INTERVIEW
  ----------------------------------------- */

  return (
    <div className="ai-interview-page">

      {/* Header */}

      <header className="ai-interview-header">

        <div className="ai-header-brand">

          <div className="ai-brand-icon">
            AI
          </div>

          <div>
            <h2>
              AI Mock Interview
            </h2>

            <span>
              PlacementIQ-AI
            </span>
          </div>

        </div>

        <div className="ai-header-center">

          <span className="live-indicator">
            <i></i>
            LIVE INTERVIEW
          </span>

        </div>

        <div className="ai-header-right">

          <div className="timer-box">
            <span>⏱</span>
            {formatTime(timeLeft)}
          </div>

          <button
            className="exit-button"
            onClick={finishInterview}
          >
            End Interview
          </button>

        </div>

      </header>

      {/* Main */}

      <main className="ai-main-content">

        {/* Left Camera */}

        <section className="candidate-section">

          <div className="section-heading">
            <div>
              <span className="heading-dot"></span>
              Candidate
            </div>

            <span
              className={
                cameraOn
                  ? "camera-status on"
                  : "camera-status"
              }
            >
              {cameraOn
                ? "Camera ON"
                : "Camera OFF"}
            </span>
          </div>

          <div className="candidate-camera">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transform: "scaleX(-1)",
                backgroundColor: "#000",
              }}
            />

            {!cameraOn && (
              <div className="camera-off">
                <div>📷</div>
                <span>
                  {cameraOn
                    ? "Camera live"
                    : "Click Camera to turn it ON"}
                </span>
              </div>
            )}

            <div className="camera-overlay">
              <span>
                {localStorage.getItem(
                  "userName"
                ) || "Candidate"}
              </span>
            </div>

          </div>

          <div className="candidate-controls">

            <button
              type="button"
              className={
                cameraOn
                  ? "control active"
                  : "control"
              }
              onClick={toggleCamera}
            >
              <span>🎥</span>
              {cameraOn ? "Camera ON" : "Camera OFF"}
            </button>

            <div
              className={
                micOn
                  ? "control active"
                  : "control"
              }
            >
              <span>🎙️</span>
              Microphone
            </div>

          </div>

          <div className="recording-card">

            <div
              className={
                isRecording
                  ? "record-icon recording"
                  : "record-icon"
              }
            >
              ●
            </div>

            <div>

              <strong>
                {isRecording
                  ? "Recording Answer"
                  : "Ready to Record"}
              </strong>

              <span>
                {isRecording
                  ? "Speak clearly and confidently"
                  : "Click Start Answer when ready"}
              </span>

            </div>

          </div>

        </section>

        {/* Right Interviewer */}

        <section className="interviewer-section">

          <div className="section-heading">

            <div>
              <span className="heading-dot ai-dot"></span>
              AI Interviewer
            </div>

            <span className="ai-online">
              <i></i>
              Online
            </span>

          </div>

          <div className="interviewer-card">

            <HumanAIInterviewer
              speaking={isSpeaking}
            />

          </div>

          {/* Question */}

          <div className="question-card">

            <div className="question-top">

              <span className="question-number">
                QUESTION{" "}
                {currentQuestion + 1}
                {" / "}
                {QUESTIONS.length}
              </span>

              <button
                className={
                  isSpeaking
                    ? "speaker-button speaking"
                    : "speaker-button"
                }
                onClick={speakQuestion}
              >
                🔊
                {isSpeaking
                  ? " Speaking..."
                  : " Hear Question"}
              </button>

            </div>

            <h2>
              {QUESTIONS[currentQuestion]}
            </h2>

            <p className="question-hint">
              Take a moment to think before
              answering. Speak clearly and
              explain your answer step-by-step.
            </p>

          </div>

          {/* Recording controls */}

          <div className="answer-controls">

            {!isRecording ? (
              <button
                className="start-answer-button"
                onClick={startRecording}
              >
                <span className="mic-circle">
                  🎙
                </span>

                <span>
                  <strong>
                    Start Answer
                  </strong>

                  <small>
                    Click to start recording
                  </small>
                </span>
              </button>
            ) : (
              <button
                className="stop-answer-button"
                onClick={stopRecording}
              >
                <span className="stop-circle">
                  ■
                </span>

                <span>
                  <strong>
                    Stop Answer
                  </strong>

                  <small>
                    Recording in progress
                  </small>
                </span>
              </button>
            )}

          </div>

          {/* Navigation */}

          <div className="question-navigation">

            <button
              className="nav-button previous"
              disabled={
                currentQuestion === 0
              }
              onClick={previousQuestion}
            >
              ← Previous
            </button>

            {currentQuestion <
            QUESTIONS.length - 1 ? (
              <button
                className="nav-button next"
                onClick={nextQuestion}
              >
                Next Question →
              </button>
            ) : (
              <button
                className="nav-button finish"
                onClick={finishInterview}
              >
                Finish Interview ✓
              </button>
            )}

          </div>

          {/* Progress */}

          <div className="question-progress">

            <div className="progress-info">

              <span>
                Interview Progress
              </span>

              <span>
                {currentQuestion + 1} /{" "}
                {QUESTIONS.length}
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      QUESTIONS.length) *
                    100
                  }%`,
                }}
              ></div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AIInterview;