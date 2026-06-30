import { useState } from "react";
import "../style/home.scss";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);

  const handleResume = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResume(file);
  };

  const handleGenerate = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description.");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      alert("Upload a resume or enter a self description.");
      return;
    }

    alert("Frontend Demo: Strategy Generated Successfully!");
  };

  return (
    <div className="home">
      <div className="container">
        {/* Heading */}

        <div className="heading">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>

          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* Main Card */}

        <div className="planner">
          {/* Left Section */}

          <div className="planner__left">
            <div className="title">
              <div className="left">
                <span className="icon">🎁</span>
                <h3>Target Job Description</h3>
              </div>

              <span className="badge">REQUIRED</span>
            </div>

            <textarea
              value={jobDescription}
              maxLength={5000}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Paste the full job description here...

Example:
Senior Frontend Engineer at Google requires proficiency in React, TypeScript, System Design and large-scale application development...
`}
            />

            <div className="counter">{jobDescription.length}/5000 chars</div>
          </div>

          {/* Right Section */}

          <div className="planner__right">
            <div className="title">
              <div className="left">
                <span className="icon">👤</span>
                <h3>Your Profile</h3>
              </div>
            </div>

            {/* Resume */}

            <label className="upload">
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleResume}
              />

              <div className="upload-content">
                <div className="upload-icon">☁</div>

                <h4>
                  {resume ? resume.name : "Click to upload or drag & drop"}
                </h4>

                <p>PDF or DOCX (Max 5 MB)</p>
              </div>
            </label>

            <div className="or">
              <span>OR</span>
            </div>

            {/* Self Description */}

            <textarea
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Briefly describe your experience, key skills and projects if you don't have a resume..."
            />

            <div className="info">
              <span>ℹ️</span>

              <p>
                Either a <strong>Resume</strong> or a
                <strong> Self Description </strong>
                is required to generate a personalized interview plan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}

        <div className="bottom">
          <div className="bottom-text">
            AI-Powered Strategy Generation • Approx 30s
          </div>

          <button className="generate-btn" onClick={handleGenerate}>
            ★ Generate My Interview Strategy
          </button>
        </div>

        {/* Footer */}

        <footer className="footer">
          <a href="/">Privacy Policy</a>

          <a href="/">Terms of Service</a>

          <a href="/">Help Center</a>
        </footer>
      </div>
    </div>
  );
}
