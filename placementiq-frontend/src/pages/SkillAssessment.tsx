import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SkillAssessment() {
  const navigate = useNavigate();

  const [stack, setStack] = useState("");

  const handleSave = () => {
    if (!stack) {
      alert("Please select a tech stack");
      return;
    }

    localStorage.setItem("selectedStack", stack);

    navigate("/aptitude-test");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Select Your Career Path</h2>

      <select
        className="form-select mb-3"
        value={stack}
        onChange={(e) => setStack(e.target.value)}
      >
        <option value="">Choose Stack</option>
        <option value="JAVA_FULLSTACK">Java Full Stack</option>
        <option value="MERN">MERN Stack</option>
        <option value="PYTHON_FULLSTACK">Python Full Stack</option>
        <option value="DATA_ANALYST">Data Analyst</option>
      </select>

      <button
        className="btn btn-primary"
        onClick={handleSave}
      >
        Save & Continue
      </button>
    </div>
  );
}

export default SkillAssessment;