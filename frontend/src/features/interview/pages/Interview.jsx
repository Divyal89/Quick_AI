import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import LoadingScreen from "./LoadingScreen";

const CircleScore = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="circle-score">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
      </svg>
      <div className="circle-score__label">
        <span className="circle-score__number">{score}</span>
        <span className="circle-score__pct">%</span>
      </div>
    </div>
  );
};

const Sidebar = ({ activeSection, setActiveSection, onDownloadResume }) => {
  const sections = [
    { id: "technical", label: "Technical Questions", icon: "<>" },
    { id: "behavioral", label: "Behavioral Questions", icon: "💬" },
    { id: "roadmap", label: "Road Map", icon: "→" },
  ];

  return (
    <aside className="sidebar">
      <p className="sidebar__heading">SECTIONS</p>

      <nav className="sidebar__nav">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`sidebar__item ${
              activeSection === s.id ? "sidebar__item--active" : ""
            }`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="sidebar__icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>

      {/* Bottom Button */}
      <div className="sidebar__download">
        <button onClick={onDownloadResume} className="download-btn">
          <span>📄</span>
          <span>Download AI Resume</span>
        </button>
      </div>
    </aside>
  );
};

const RightPanel = ({ report }) => (
  <aside className="right-panel">
    <p className="right-panel__heading">MATCH SCORE</p>
    <CircleScore score={report.matchScore} />
    <p className="right-panel__strong">Strong match for this role</p>

    <p className="right-panel__heading" style={{ marginTop: "2rem" }}>
      SKILL GAPS
    </p>
    <div className="skill-gaps">
      {report.skillGaps.map((g, i) => (
        <span key={i} className={`skill-gap skill-gap--${g.severity}`}>
          {g.skill}
        </span>
      ))}
    </div>
  </aside>
);

const TechnicalQuestions = ({ report }) => {
  const [open, setOpen] = useState(null);

  return (
    <section className="content-section">
      <h2 className="section-title">
        Technical Questions{" "}
        <span className="section-badge">
          {report.technicalQuestions.length} questions
        </span>
      </h2>

      <div className="question-list">
        {report.technicalQuestions.map((q, index) => (
          <div
            key={index}
            className={`question-card ${
              open === index ? "question-card--open" : ""
            }`}
            onClick={() => setOpen(open === index ? null : index)}
          >
            <div className="question-card__row">
              {/* Show question number */}
              <span className="question-card__id">{index + 1}</span>

              <p className="question-card__text">{q.question}</p>

              <span className="question-card__chevron">
                {open === index ? "▲" : "▼"}
              </span>
            </div>

            {open === index && (
              <div className="question-card__body">
                <h4>Interviewer Intention</h4>
                <p>{q.intention}</p>

                <h4>Suggested Answer</h4>
                <p>{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const BehavioralQuestions = ({ report }) => {
  const [open, setOpen] = useState(null);
  console.log("Behavioral Questions:", report.behavioralQuestions);

  return (
    <section className="content-section">
      <h2 className="section-title">
        Behavioral Questions{" "}
        <span className="section-badge">
          {report.behavioralQuestions.length} questions
        </span>
      </h2>

      <div className="question-list">
        {report.behavioralQuestions.map((q, index) => (
          <div
            key={index}
            className={`question-card question-card--behavioral ${
              open === index ? "question-card--open" : ""
            }`}
          >
            <div
              className="question-card__row"
              onClick={() => setOpen(open === index ? null : index)}
            >
              {/* Question Number */}
              <span className="question-card__id">{index + 1}</span>

              <p className="question-card__text">{q.question}</p>

              <span className="question-card__chevron">
                {open === index ? "▲" : "▼"}
              </span>
            </div>

            {open === index && (
              <div className="question-card__body">
                <div className="bq-tag bq-tag--intention">INTENTION</div>
                <p className="bq-intention">{q.intention}</p>

                <div className="bq-tag bq-tag--model">MODEL ANSWER</div>
                <p className="bq-model">{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const RoadMap = ({ report }) => (
  <section className="content-section">
    <h2 className="section-title">
      Preparation Road Map <span className="section-badge">7-day plan</span>
    </h2>

    <div className="roadmap">
      {report.preparationPlan.map((item) => (
        <div key={item.day} className="roadmap__item">
          <div className="roadmap__connector">
            <div className="roadmap__dot" />
            <div className="roadmap__line" />
          </div>

          <div className="roadmap__content">
            <span className="roadmap__day">Day {item.day}</span>

            <h3 className="roadmap__title">{item.focus}</h3>

            <ul className="roadmap__tasks">
              {item.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default function Interview() {
  const { interviewId } = useParams();

  const { report, loading, getReportById, getResumePdf } = useInterview();

  const [activeSection, setActiveSection] = useState("technical");

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // ✅ Wait until loading is finished
  if (loading) {
    return <LoadingScreen />;
  }

  // ✅ Wait until report is fetched
  if (!report) {
    return <h2>No Report Found</h2>;
  }

  // ✅ Now report definitely exists
  console.log("REPORT KEYS:", Object.keys(report));
  console.log(report);

  return (
    <div className="interview-app">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onDownloadResume={() => getResumePdf(interviewId)}
      />

      <main className="interview-main">
        {activeSection === "technical" && (
          <TechnicalQuestions report={report} />
        )}

        {activeSection === "behavioral" && (
          <BehavioralQuestions report={report} />
        )}

        {activeSection === "roadmap" && <RoadMap report={report} />}
      </main>

      <RightPanel report={report} />
    </div>
  );
}
