import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 to 100"),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and what approach to follow",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and answers",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, and what approach to follow",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and answers",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of this skill gap"),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe("The main focus of this day in the preparation plan"),
        tasks: z
          .array(z.string())
          .describe("List of tasks to be done on this day"),
      }),
    )
    .describe("A day-wise preparation plan for the candidate to follow"),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Genearte an interview report for a candidate with the following details :
      Resume: ${resume}
      Self Description: ${selfDescription}
      Job Description: ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });
  const report = JSON.parse(response.text);

  console.log(JSON.stringify(report, null, 2));
}

export default generateInterviewReport;
