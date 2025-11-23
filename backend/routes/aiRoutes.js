// routes/aiRoutes.js
// Groq-powered AI routes for AI Resume Builder
import dotenv from "dotenv";
import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
dotenv.config();
// ───────────────────────────────────────────────
//  Groq Client — FINAL MODEL (v2)
// ───────────────────────────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Universal text generation helper
async function generateText(prompt) {
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
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI returned empty response");
    return text;
  } catch (err) {
    console.error("Groq generateText error:", err);
    throw err;
  }
}

// Extract JSON safely even if wrapped in markdown
function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Invalid JSON returned by AI");
  }
  return JSON.parse(text.slice(start, end + 1));
}

// ───────────────────────────────────────────────
// ROUTES
// ───────────────────────────────────────────────

// SUMMARY — AI Improve Summary
router.post("/generate-summary", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: "prompt is required" });

  try {
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
  } catch (err) {
    res.status(500).json({ message: "AI summary failed" });
  }
});

// SKILLS — AI Generate Skills
router.post("/generate-skills", async (req, res) => {
  const { keywords } = req.body;

  if (!keywords) return res.status(400).json({ message: "keywords required" });

  try {
    const text = await generateText(`
Extract professional SKILLS ONLY from this text.

Return ONLY comma-separated skills:
${keywords}
    `);

    const skills = text
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "AI skills generation failed" });
  }
});

// EXPERIENCE — AI Auto Bullets
router.post("/generate-experience", async (req, res) => {
  const { role, company, tech, notes } = req.body;

  try {
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
  } catch (err) {
    res.status(500).json({ message: "AI experience generation failed" });
  }
});

// ATS SCORE — AI Resume vs Job Description
router.post("/ats-check", async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription)
    return res.status(400).json({
      message: "resumeText and jobDescription required",
    });

  try {
    const text = await generateText(`
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
    `);

    res.json(extractJson(text));
  } catch (err) {
    res.status(500).json({ message: "AI ATS check failed" });
  }
});

// FULL RESUME GENERATOR — Build everything from keywords
router.post("/generate-full", async (req, res) => {
  const { keywords, targetRole } = req.body;

  if (!keywords) return res.status(400).json({ message: "keywords required" });

  try {
    const text = await generateText(`
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
    `);

    res.json(extractJson(text));
  } catch (err) {
    res.status(500).json({ message: "AI full resume generation failed" });
  }
});

export default router;
