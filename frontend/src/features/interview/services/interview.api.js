import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Generate Interview Report
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resume,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resume);

  const response = await api.post("/api/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

// Get Report by ID
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

// Get All Reports
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
};

// Generate Resume PDF
export const generateResumePdf = async ({ interviewId }) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewId}`,
    null,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

  return response.data;
};
