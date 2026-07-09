import { PDFParse } from "pdf-parse";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

async function generateInterviewReportController(req, res) {
  try {
    console.log("========== Generate Interview Report ==========");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // Validate resume
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
      });
    }

    console.log("Parsing PDF...");

    const resumeContent = await new PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();

    console.log("✅ PDF parsed successfully");

    const { selfDescription, jobDescription } = req.body;

    console.log("Generating AI report...");

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    console.log("✅ AI report generated");

    console.log("Saving report to MongoDB...");

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    console.log("✅ Report saved successfully");

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("❌ Error in generateInterviewReportController");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    return res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

async function generateResumePdfController(req, res) {
  console.log("========== PDF Controller ==========");
  console.log(req.params);
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found",
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription,
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume_${interviewId}.pdf`,
    );

    return res.send(pdfBuffer);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

export {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
