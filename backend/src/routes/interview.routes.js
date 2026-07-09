import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";

import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

console.log("authUser:", typeof authMiddleware.authUser);
console.log("upload.single:", typeof upload.single);
console.log(
  "generateInterviewReportController:",
  typeof generateInterviewReportController,
);

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  generateInterviewReportController,
);

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  getInterviewReportByIdController,
);

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  getAllInterviewReportsController,
);

interviewRouter.post(
  "/resume/pdf/:interviewId",
  authMiddleware.authUser,
  generateResumePdfController,
);

export default interviewRouter;
