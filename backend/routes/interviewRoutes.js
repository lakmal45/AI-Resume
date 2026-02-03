import express from "express";
import Groq from "groq-sdk";
import Resume from "../models/Resume.js";
import InterviewQuestions from "../models/InterviewQuestions.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// -------------------------------
// GET: Fetch user resumes
// -------------------------------
router.get("/resumes/:userId", auth, async (req, res) => {
  const resumes = await Resume.find({ userId: req.params.userId });
  res.json(resumes);
});

// -------------------------------
// POST: Generate + Save Questions
// -------------------------------
router.post("/generate", async (req, res) => {
  const { userId, resumeId, role } = req.body;

  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const prompt = `
Generate 20 interview questions based on this resume.

Categorize into:
1. Technical Questions
2. Behavioral Questions
3. Project-Based Questions
4. Role-Specific Questions (Role: ${role || "Not specified"})

Each question must include a short answer.

Resume:
${resume.resumeText}
  `;

  try {
    const aiRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const output = aiRes.choices[0].message.content;

    const saved = await InterviewQuestions.create({
      userId,
      resumeId,
      role,
      questions: output,
    });

    res.json({ success: true, saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
