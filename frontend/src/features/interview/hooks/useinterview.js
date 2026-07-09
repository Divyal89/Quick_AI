import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, reports, setReports, report, setReport } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;

    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resume: resumeFile,
      });

      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;

    try {
      response = await getInterviewReportById(interviewId);

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
  };

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      setReports(response.interviewReports);

      return response.interviewReports;
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewId) => {
    setLoading(true);

    try {
      const response = await generateResumePdf({ interviewId });

      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `resume_${interviewId}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
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
    getResumePdf,
  };
};
