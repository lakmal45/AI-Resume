import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  generateSummarySchema,
  generateSkillsSchema,
  generateExperienceSchema,
  atsCheckSchema,
  generateFullSchema,
} from "../validators/schemas.js";

const router = express.Router();
dotenv.config();
// ───────────────────────────────────────────────
//  Groq Client — FINAL MODEL (v2)
// ───────────────────────────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateText(prompt, options = {}) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ✅ FINAL, working, production-safe
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer, ATS optimizer, and JSON generator for software engineers.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.45,
      max_tokens: 1800,
      ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI returned empty response");
    
    if (options.jsonMode) {
      return JSON.parse(text);
    }
    
    return text;
  } catch (err) {
    console.error("Groq generateText error:", err);
    throw err;
  }
}

// ───────────────────────────────────────────────
// ROUTES
// ───────────────────────────────────────────────

// SUMMARY — AI Improve Summary
router.post(
  "/generate-summary",
  auth,
  validate(generateSummarySchema),
  asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    const text = await generateText(`
Write a 4–6 sentence resume summary for a junior software engineer or intern.

Details:
${prompt}

Guidelines:
- 100–140 words
- ATS friendly
- No 'I', 'me', or personal tone
- Strong action verbs
- Sri Lankan tech student context OK
    `);

    res.json({ summary: text });
  })
);

// SKILLS — AI Generate Skills
router.post(
  "/generate-skills",
  auth,
  validate(generateSkillsSchema),
  asyncHandler(async (req, res) => {
    const { keywords, role } = req.body;

    const text = await generateText(`
Extract professional SKILLS related to this field: ${keywords}.
and for this role: ${role}.
Return ONLY comma-separated skills, make sure they are relevant to useful for a ${role} resume, and need more than 10 and less than 15 skills:
${keywords}
    `);

    const skills = text
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    res.json({ skills });
  })
);

// EXPERIENCE — AI Auto Bullets
router.post(
  "/generate-experience",
  auth,
  validate(generateExperienceSchema),
  asyncHandler(async (req, res) => {
    const { role, company, tech, notes } = req.body;

    const text = await generateText(`
Write 4 strong resume bullet points:

Role: ${role}
Company: ${company}
Tech Used: ${tech}
Notes: ${notes}

Rules:
- Start with ACTION verbs
- Include metrics when possible
- Max 20 words per bullet
- Do NOT include numbering or dashes
    `);

    const bullets = text
      .split("\n")
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);

    res.json({ bullets });
  })
);

// ATS SCORE — AI Resume vs Job Description
router.post(
  "/ats-check",
  auth,
  validate(atsCheckSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    const result = await generateText(`
You are an ATS analyzer.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY JSON:
{
  "score": 0-100,
  "missingKeywords": ["kw1", "kw2"],
  "suggestions": ["sentence1", "sentence2"]
}
    `, { jsonMode: true });

    res.json(result);
  })
);

// FULL RESUME GENERATOR — Build everything from keywords
router.post(
  "/generate-full",
  auth,
  validate(generateFullSchema),
  asyncHandler(async (req, res) => {
    const { keywords, targetRole } = req.body;

    const result = await generateText(`
Create a FULL resume JSON.

Keywords:
${keywords}

Target Role:
${targetRole || "Software Engineer Intern"}

Return ONLY JSON:
{
  "header": {
    "name": "Your Name",
    "role": "...",
    "email": "...",
    "phone": "+94..."
  },
  "summary": "...",
  "skills": ["...", "..."],
  "experience": [
    {
      "role": "...",
      "company": "...",
      "bullets": ["...", "..."]
    }
  ],
  "projects": [
    {
      "name": "...",
      "desc": "...",
      "tech": ["...", "..."]
    }
  ],
  "education": [
    {
      "school": "...",
      "degree": "...",
      "year": "..."
    }
  ]
}
    `, { jsonMode: true });

    res.json(result);
  })
);

export default router;
