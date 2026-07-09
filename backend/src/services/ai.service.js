import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

dotenv.config();

// Check if API key exists
if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("GOOGLE_GENAI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const interviewReportSchema = z.object({
  title: z.string().describe("Title of the interview report"),

  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall match score between candidate and job description"),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    console.log("========== AI SERVICE ==========");
    console.log("API Key Loaded: ✅");
    console.log("Calling Gemini...");

    const prompt = `
You are an expert technical interviewer.

Analyze the following candidate profile and job description.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate:
1. A report title.
2. Match score (0-100).
3. 10 technical interview questions with intention and ideal answer.
4. 5 behavioral interview questions with intention and ideal answer.
5. Skill gaps with severity.
6. A 7-day preparation plan.

Return ONLY valid JSON matching the provided schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    console.log("✅ Gemini response received");

    const report = JSON.parse(response.text);

    console.log("========== GENERATED REPORT ==========");
    console.log(JSON.stringify(report, null, 2));

    return report;
  } catch (error) {
    console.error("❌ AI Service Error");
    console.error(error);

    throw error;
  }
}

async function generatePdffromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "25mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    htmlContent: z
      .string()
      .describe("HTML content of the resume which will be converted to PDF"),
  });

  const prompt = `
You are a Senior Resume Writer, ATS Resume Specialist, and Technical Recruiter.

Using the candidate information below, generate a professional ATS-friendly resume tailored specifically to the given Job Description.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON matching the provided schema.

{
  "htmlContent": "<complete HTML>"
}

==========================
STRICT FORMAT
==========================

The resume MUST contain ONLY these sections in this exact order:

1. Candidate Name

2. Contact Information
   - LinkedIn
   - Email
   - GitHub
   - Phone
   - Location

3. PROFESSIONAL SUMMARY

Requirements:

- 3–5 concise lines
- Tailored to the Job Description
- Highlight strongest technologies
- Naturally include important ATS keywords
- Sound like a human-written professional resume
- Avoid generic AI phrases

4. TECHNICAL SKILLS

Organize skills exactly like this:

• Languages

• Frontend

• Backend

• Databases

• Core Computer Science

• Tools

• Cloud & Deployment

• Testing

• Exposure

Only include skills supported by the candidate profile.

5. EDUCATION

Include

College

Degree

CGPA

Expected Graduation

Relevant Coursework

6. EXPERIENCE

Company

Role

Duration

Write 4–6 achievement-oriented bullet points.

Every bullet must:

- Start with a strong action verb

Examples:

Developed

Designed

Built

Implemented

Optimized

Engineered

Integrated

Architected

Created

Improved

Automated

Deployed

Mention:

- technologies used
- engineering contribution
- business impact
- measurable improvements whenever possible

Do NOT invent fake experience.

Expand existing responsibilities professionally.

7. PROJECTS

Include maximum 3 projects.

Format:

Project Name — Technologies (Duration)

Write one short overview sentence.

Then include 4–6 achievement bullets.

Describe:

- architecture
- implementation
- APIs
- authentication
- database
- deployment
- optimization
- engineering challenges solved

Use strong engineering language.

Expand existing projects only.

Never invent projects.

Where realistic, include measurable impact such as:

35%

50+

500+

2x

40%

8. CERTIFICATIONS & ACHIEVEMENTS

Maximum 5 concise bullet points.

==========================
ATS OPTIMIZATION
==========================

Extract important keywords from the Job Description.

Naturally integrate those keywords into:

- Professional Summary
- Skills
- Experience
- Projects

Avoid keyword stuffing.

==========================
HTML REQUIREMENTS
==========================

Generate clean ATS-friendly semantic HTML.

Use:

- Arial, Helvetica, sans-serif
- Body font: 11px
- Candidate Name: 22px
- Section Heading: 13px
- A4 Page
- Margin: 14px
- Line Height: 1.18

Use only these colors:

Primary:
#e91e8c

Text:
#222222

Secondary:
#666666

Section headings should:

- Be bold
- Have a thin bottom border
- Maintain consistent spacing

Do NOT use:

- tables
- icons
- images
- emojis
- multiple columns
- SVG
- absolute positioning
- floating elements

Everything must remain ATS parsable.

==========================
PAGE UTILIZATION
==========================

The final resume MUST fit on EXACTLY ONE A4 page.

The content should occupy approximately 90–98% of the page.

Never leave noticeable blank space at the bottom.

If the candidate has limited information:

Expand ONLY existing information by:

- improving the professional summary
- elaborating project implementation
- explaining technologies used
- describing engineering decisions
- explaining architecture
- expanding experience responsibilities
- expanding coursework
- highlighting technical strengths

Do NOT invent fake companies, fake experience, fake certifications, fake projects, fake achievements, or fake metrics.

If the resume becomes longer than one page:

- shorten bullet points
- reduce spacing slightly
- compress margins slightly
- remove unnecessary wording

until everything fits perfectly on ONE page.

The page should look visually balanced from top to bottom without obvious empty regions.

==========================
FINAL QUALITY CHECK
==========================

Before generating HTML ensure:

✓ ATS Friendly

✓ Professional

✓ Recruiter Ready

✓ Human-written tone

✓ Tailored to Job Description

✓ Strong action verbs

✓ Clean formatting

✓ No fake information

✓ One-page resume

✓ Nearly full-page utilization

✓ No large blank space at the bottom

Return ONLY valid JSON.

Do not return markdown.

Do not include explanations.

Return only the JSON object.
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });
  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdffromHtml(jsonContent.htmlContent);

  return pdfBuffer;
}

export { generateInterviewReport, generateResumePdf };
