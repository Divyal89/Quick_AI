import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);

  const value = {
    loading,
    setLoading,
    reports,
    setReports,
    report,
    setReport,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};
