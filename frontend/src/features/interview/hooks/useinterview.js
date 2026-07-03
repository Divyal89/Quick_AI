import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
} from "../services/interview.api";

const context = useContext(InterviewContext);

if (!context) {
  throw new Error("useInterview must be used within an InterviewProvider");
}

const { loading, setLoading, reports, setReports, report, setReport } = context;

const generateReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  setLoading(true);

  try {
    const response = await generateInterviewReport({
      jobDescription,
      selfDescription,
      resume: resumeFile,
    });
    setReport(response.interviewReport);
  } catch (error) {
    console.error("Error generating interview report:", error);
  } finally {
    setLoading(false);
  }
};

const getReportById = async (interviewId) => {
  setLoading(true);

  try {
    const response = await getInterviewReportById(interviewId);
    setReport(response.interviewReport);
  } catch (error) {
    console.error("Error fetching interview report by ID:", error);
  } finally {
    setLoading(false);
  }
};

const getReports = async () => {
  setLoading(true);
  try {
    const response = await getAllInterviewReports();
    setReports(response.interviewReports);
  } catch (error) {
    console.error("Error fetching all interview reports:", error);
  } finally {
    setLoading(false);
  }
};

return {
  loading,
  reports,
  report,
  generateReport,
  getReportById,
  getReports,
};
