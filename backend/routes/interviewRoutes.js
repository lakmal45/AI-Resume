import express from "express";
import Groq from "groq-sdk";
import Resume from "../models/Resume.js";
import InterviewQuestions from "../models/InterviewQuestions.js";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { interviewGenerateSchema } from "../validators/schemas.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// -------------------------------
// GET: Fetch user resumes
// -------------------------------

router.get(
  "/resume/:resumeId",
  auth,
  asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  })
);

// -------------------------------
// GET: Fetch user's interview question history
// -------------------------------
router.get(
  "/history",
  auth,
  asyncHandler(async (req, res) => {
    const history = await InterviewQuestions.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  })
);

// -------------------------------
// POST: Generate + Save Questions
// -------------------------------
router.post(
  "/generate",
  auth,
  validate(interviewGenerateSchema),
  asyncHandler(async (req, res) => {
    const { resumeId, role } = req.body;
    const userId = req.user.id;

    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const prompt = `
Generate 12 interview questions based on this resume.

Categorize into: "Technical", "Behavioral", "Project-Based", "Role-Specific" (Role: ${role || "Not specified"}).

You MUST respond ONLY with a valid JSON object in this exact format. Do not include markdown code blocks or any other text.
{
  "categories": [
    {
      "name": "Technical",
      "questions": [
        { "question": "...", "answer": "..." }
      ]
    }
  ]
}

Resume:
${resume.resumeJson}
  `;

    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    let output = aiRes.choices[0].message.content;
    let parsedData = {};
    try {
      parsedData = JSON.parse(output);
    } catch (err) {
      console.error("Failed to parse JSON:", output);
      return res.status(500).json({ error: "Failed to generate structured questions." });
    }

    const saved = await InterviewQuestions.create({
      userId,
      resumeId,
      role,
      questions: parsedData,
    });

    res.json({ success: true, saved });
  })
);

export default router;
