import { useEffect, useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

export default function Home() {
  const { loading, generateReport, reports, getReports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);

  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      console.log(window.scrollY);
      setOffsetY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resumeInputRef = useRef();

  const handleResume = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setResume(file);
  };

  useEffect(() => {
    getReports();
  }, []);

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/interview/report/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <LoadingScreen />
      </main>
    );
  }

  return (
    <div className="home">
      {/* ===== Floating Parallax Objects ===== */}

      <div
        className="floating floating-1"
        style={{
          transform: `translateY(${offsetY * 0.2}px)`,
        }}
      />

      <div
        className="floating floating-2"
        style={{
          transform: `translateY(${offsetY * 0.4}px)`,
        }}
      />

      <div
        className="floating floating-3"
        style={{
          transform: `translateY(${offsetY * 0.6}px)`,
        }}
      />

      <div
        className="floating floating-4"
        style={{
          transform: `translateY(${offsetY * 0.8}px)`,
        }}
      />

      <div
        className="floating floating-5"
        style={{
          transform: `translateY(${offsetY * 1}px)`,
        }}
      />

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
                ref={resumeInputRef}
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

          <button
            className="generate-btn"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            ★ Generate My Interview Strategy
          </button>
        </div>

        {/* Recent report list */}

        {reports.length > 0 && (
          <div className="recent-reports">
            <h2>Recent Reports</h2>

            <ul className="report-list">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/report/${report._id}`)}
                >
                  <h3>{report.title || "Untitled Position"}</h3>

                  <p className="report-meta">
                    Generated on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

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
