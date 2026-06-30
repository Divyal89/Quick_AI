import { useState } from "react";
import "../style/interview.scss";

const data = {
  matchScore: 88,
  skillGaps: [
    { label: "Message Queues (Kafka/RabbitMQ)", color: "red" },
    { label: "Advanced Docker & CI/CD Pipelines", color: "orange" },
    { label: "Distributed Systems Design", color: "green" },
    { label: "Production-level Redis management", color: "green" },
  ],
  technicalQuestions: [
    {
      id: "Q1",
      question:
        "Explain the Node.js event loop and how it handles asynchronous I/O operations.",
    },
    {
      id: "Q2",
      question:
        "How do you optimize a MongoDB aggregation pipeline for high-volume data?",
    },
    {
      id: "Q3",
      question:
        "Can you describe the Cache-Aside pattern and when you would use Redis in a Node.js application?",
    },
    {
      id: "Q4",
      question:
        "What are the challenges of migrating a monolithic application to a modular service-based architecture?",
    },
  ],
  behavioralQuestions: [
    {
      id: "Q1",
      question:
        "Describe a time when you had to optimize a piece of code that was causing production delays. How did you identify the bottleneck?",
      intention:
        "To evaluate problem-solving skills and the use of monitoring/profiling tools.",
      modelAnswer:
        "The candidate should use the STAR method. They should mention using tools like Chrome DevTools, New Relic, or MongoDB Atlas Profiler, the specific metrics they looked at, and the measurable impact of their fix.",
    },
    {
      id: "Q2",
      question:
        "How do you approach learning a new technology, such as your recent work with the Gemini API?",
      intention:
        "To assess adaptability and the ability to stay updated with industry trends.",
      modelAnswer:
        "The candidate should describe their process: reading official documentation, building a proof-of-concept, understanding the limitations, and eventually integrating it into a structured project.",
    },
  ],
  roadmap: [
    {
      day: 1,
      title: "Node.js Internals & Streams",
      tasks: [
        "Deep dive into the Event Loop phases and process.nextTick vs setImmediate.",
        "Practice implementing Node.js Streams for handling large data sets.",
      ],
    },
    {
      day: 2,
      title: "Advanced MongoDB & Indexing",
      tasks: [
        "Study Compound Indexes, TTL Indexes, and Text Indexes.",
        "Practice writing complex Aggregation pipelines and using the .explain('executionStats') method.",
      ],
    },
    {
      day: 3,
      title: "Caching & Redis Strategies",
      tasks: [
        "Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets).",
        "Implement a Redis-based rate limiter or a caching layer for a sample API.",
      ],
    },
    {
      day: 4,
      title: "System Design & Microservices",
      tasks: [
        "Study Microservices communication patterns (Synchronous vs Asynchronous).",
        "Learn about the API Gateway pattern and Circuit Breakers.",
      ],
    },
    {
      day: 5,
      title: "Message Queues & DevOps Basics",
      tasks: [
        "Watch introductory tutorials on RabbitMQ or Kafka.",
        "Dockerize a project and write a simple GitHub Actions workflow for CI.",
      ],
    },
    {
      day: 6,
      title: "Data Structures & Algorithms",
      tasks: [
        "Solve 5-10 Medium LeetCode problems focusing on Arrays, Strings, and Hash Maps.",
        "Review common sorting and searching algorithms.",
      ],
    },
    {
      day: 7,
      title: "Mock Interview & Project Review",
      tasks: [
        "Conduct a mock interview focusing on explaining the Real-time Chat Application architecture.",
        "Review your project's README and be ready to discuss technical decisions.",
      ],
    },
  ],
};

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

const Sidebar = ({ activeSection, setActiveSection }) => {
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
            className={`sidebar__item ${activeSection === s.id ? "sidebar__item--active" : ""}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="sidebar__icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const RightPanel = () => (
  <aside className="right-panel">
    <p className="right-panel__heading">MATCH SCORE</p>
    <CircleScore score={data.matchScore} />
    <p className="right-panel__strong">Strong match for this role</p>

    <p className="right-panel__heading" style={{ marginTop: "2rem" }}>
      SKILL GAPS
    </p>
    <div className="skill-gaps">
      {data.skillGaps.map((g, i) => (
        <span key={i} className={`skill-gap skill-gap--${g.color}`}>
          {g.label}
        </span>
      ))}
    </div>
  </aside>
);

const TechnicalQuestions = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="content-section">
      <h2 className="section-title">
        Technical Questions{" "}
        <span className="section-badge">
          {data.technicalQuestions.length} questions
        </span>
      </h2>
      <div className="question-list">
        {data.technicalQuestions.map((q) => (
          <div
            key={q.id}
            className={`question-card ${open === q.id ? "question-card--open" : ""}`}
            onClick={() => setOpen(open === q.id ? null : q.id)}
          >
            <div className="question-card__row">
              <span className="question-card__id">{q.id}</span>
              <p className="question-card__text">{q.question}</p>
              <span className="question-card__chevron">
                {open === q.id ? "▲" : "▼"}
              </span>
            </div>
            {open === q.id && (
              <div className="question-card__body">
                <p className="question-card__hint">
                  Prepare a structured answer using the STAR method or a clear
                  technical explanation backed by examples from your experience.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const BehavioralQuestions = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="content-section">
      <h2 className="section-title">
        Behavioral Questions{" "}
        <span className="section-badge">
          {data.behavioralQuestions.length} questions
        </span>
      </h2>
      <div className="question-list">
        {data.behavioralQuestions.map((q) => (
          <div
            key={q.id}
            className={`question-card question-card--behavioral ${open === q.id ? "question-card--open" : ""}`}
          >
            <div
              className="question-card__row"
              onClick={() => setOpen(open === q.id ? null : q.id)}
            >
              <span className="question-card__id">{q.id}</span>
              <p className="question-card__text">{q.question}</p>
              <span className="question-card__chevron">
                {open === q.id ? "▲" : "▼"}
              </span>
            </div>
            {open === q.id && (
              <div className="question-card__body">
                <div className="bq-tag bq-tag--intention">INTENTION</div>
                <p className="bq-intention">{q.intention}</p>
                <div className="bq-tag bq-tag--model">MODEL ANSWER</div>
                <p className="bq-model">{q.modelAnswer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const RoadMap = () => (
  <section className="content-section">
    <h2 className="section-title">
      Preparation Road Map <span className="section-badge">7-day plan</span>
    </h2>
    <div className="roadmap">
      {data.roadmap.map((item) => (
        <div key={item.day} className="roadmap__item">
          <div className="roadmap__connector">
            <div className="roadmap__dot" />
            <div className="roadmap__line" />
          </div>
          <div className="roadmap__content">
            <span className="roadmap__day">Day {item.day}</span>
            <h3 className="roadmap__title">{item.title}</h3>
            <ul className="roadmap__tasks">
              {item.tasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default function Interview() {
  const [activeSection, setActiveSection] = useState("technical");

  return (
    <div className="interview-app">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="interview-main">
        {activeSection === "technical" && <TechnicalQuestions />}
        {activeSection === "behavioral" && <BehavioralQuestions />}
        {activeSection === "roadmap" && <RoadMap />}
      </main>
      <RightPanel />
    </div>
  );
}
