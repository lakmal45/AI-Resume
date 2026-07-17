import express from "express";
import fs from "fs/promises";
import path from "path";
import Groq from "groq-sdk";
import crypto from "crypto";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { atsAnalyzeSchema } from "../validators/schemas.js";
import multer from "multer";
import { extractTextHybrid } from "../utils/extractTextHybrid.js";
import ATSAnalysis from "../models/ATSAnalysis.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
// helper for unique ids
const id = () => crypto.randomUUID();

// --- NEW: Extract resume file and convert to parsed resume JSON ---
router.post(
  "/extract-resume",
  auth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    try {
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      // extract text (hybrid PDF/text or image OCR)
      const text = await extractTextHybrid(file.path, file.mimetype);

      // ask AI to parse resume text into resume JSON (summary, skills, experience, education, bullets)
      const parsePrompt = `
You are a resume parsing assistant. Convert the following resume text into JSON with fields:
{ 
  "header": { "name": "...", "role": "...", "email":"", "phone": "" },
  "summary": "...",
  "skills": ["..."],
  "experience": [ { "company":"", "role":"", "bullets":[ "..."] } ],
  "education": [ "..." ],
  "projects": [...]
}
Return valid JSON only.
--- RESUME_TEXT ---
${text}
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: parsePrompt }],
        response_format: { type: "text" },
        temperature: 0.0,
        max_tokens: 1200,
      });

      let parsed = {};
      try {
        parsed = JSON.parse(completion.choices[0].message.content);
      } catch (e) {
        // If parsing fails, still return raw text
        parsed = { rawText: text };
      }

      return res.json({ parsed, text });
    } catch (err) {
      console.error("extract-resume error:", err);
      return res
        .status(500)
        .json({ error: "Failed to extract or parse resume" });
    } finally {
      // cleanup upload
      if (file && file.path) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error("Cleanup failed for file:", file.path, err);
        }
      }
    }
  })
);

// --- Analyze route ---
router.post(
  "/analyze",
  auth,
  validate(atsAnalyzeSchema),
  asyncHandler(async (req, res) => {
    const { resume, jobDescription = "" } = req.body;

    const resumeData = jobDescription ? jobDescription : {};

    const prompt = `
You are an ATS auditor AI. Inputs: ${resume} and optionally a ${resumeData}.
Return ONLY valid JSON matching the schema exactly (no extra text, no comments):

{
  "analysisId": "<string>",
  "atsScore": 0,            // 0-100 overall ATS compatibility
  "metrics": {
    "keywordMatch": 0,     // 0-100 how many JD keywords are present (if JD provided)
    "formattingIssuesScore": 0, // 0-100 count of formatting problems (higher = worse)
    "grammarIssuesScore": 0     // 0-100 count of grammar issues (higher = worse)
  },
  "summary": "<short summary of issues>",
  "missingKeywords": ["..."],
  "formattingIssues": ["list of formatting problems"],
  "grammarSuggestions": ["short grammar fixes"],
  "suggestions": [
    {
      "id": "<string>",
      "title": "<short title>",
      "category": "keyword|formatting|grammar|metrics|other",
      "impact": "<Low|Medium|High>",
      "explanation": "<human readable explanation>",
      "proposedChange": "<exact text or JSON patch to apply>"
    }
  ],
  "createdAt": "<ISO timestamp>"
}

Rules:
- Use resume JSON fields (summary, skills, experience, education, bullets).
- If jobDescription provided, extract keywords from it and compute keywordMatch.
- Compute atsScore using heuristics (weights: keywords 45%, formatting 25%, grammar 20%, metrics presence 10%).
- Provide actionable suggestions with proposedChange that can be directly applied (e.g., updated bullet text).
- Keep proposedChange short; if it is a replacement for a bullet, provide the full new bullet text.
- Ensure JSON is parseable.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1500,
    });

    let data;
    try {
      data = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(502).json({ error: "AI returned invalid JSON. Please try again." });
    }

    data.analysisId = crypto.randomUUID();
    data.createdAt = data.createdAt || new Date().toISOString();

    try {
      await ATSAnalysis.create({
        userId: req.user?.id || null,
        sourceType: resume && resume._id ? "resume" : "upload",
        sourceRef: resume && resume._id ? resume._id : null,
        analysisId: data.analysisId,
        atsScore: data.atsScore,
        metrics: data.metrics,
        summary: data.summary,
        missingKeywords: data.missingKeywords,
        formattingIssues: data.formattingIssues,
        grammarSuggestions: data.grammarSuggestions,
        suggestions: data.suggestions,
        rawResponse: data,
      });
    } catch (e) {
      console.error("❌ ATSAnalysis DB save failed:", e);
      return res.status(500).json({ error: "Failed to save ATS analysis" });
    }

    return res.json(data);
  })
);

// --- Apply suggestions route ---
router.post(
  "/apply",
  auth,
  asyncHandler(async (req, res) => {
    const { resume, suggestions, analysisId } = req.body;

    if (!resume || !suggestions) {
      return res.status(400).json({ error: "resume and suggestions are required" });
    }

    // clone resume
    const updated = JSON.parse(JSON.stringify(resume));

    // suggestions are expected to include proposedChange
    // We'll apply changes conservatively:
    suggestions.forEach((s) => {
      // common patterns: replace summary, add keywords, replace a specific bullet
      if (s.category === "keyword" && Array.isArray(s.proposedChange)) {
        updated.skills = Array.from(
          new Set([...(updated.skills || []), ...s.proposedChange])
        );
      } else if (
        s.title.toLowerCase().includes("summary") ||
        (s.category === "other" && s.title.toLowerCase().includes("summary"))
      ) {
        updated.summary = s.proposedChange;
      } else if (
        s.category === "metrics" ||
        s.title.toLowerCase().includes("bullet")
      ) {
        // proposedChange expected to be a JSON path hint; prefer explicit replacement text
        // If s.target exists, apply to that experience bullet; otherwise replace first experience's bullets
        if (
          s.target &&
          s.target.experienceIndex != null &&
          s.target.bulletIndex != null
        ) {
          updated.experience[s.target.experienceIndex].bullets[
            s.target.bulletIndex
          ] = s.proposedChange;
        } else {
          // fallback: append or replace first bullet
          if (!updated.experience)
            updated.experience = [{ company: "", role: "", bullets: [] }];
          updated.experience[0].bullets = updated.experience[0].bullets || [];
          // if proposedChange indicates replacement with index in string, try to parse target; else push
          updated.experience[0].bullets.push(s.proposedChange);
        }
      } else if (s.category === "formatting") {
        // for formatting, proposedChange may be instructions; we can store as metadata
        updated._formattingNotes = updated._formattingNotes || [];
        updated._formattingNotes.push(s.proposedChange);
      } else if (s.category === "grammar") {
        // proposedChange contains fixed sentence(s)
        updated._grammarFixes = updated._grammarFixes || [];
        updated._grammarFixes.push(s.proposedChange);
      } else {
        // generic fallback: store under suggestionsApplied
        updated.suggestionsApplied = updated.suggestionsApplied || [];
        updated.suggestionsApplied.push({ id: s.id, change: s.proposedChange });
      }
    });

    return res.json({ updatedResume: updated });
  })
);

// --- history reads from Mongo DB ---
router.get(
  "/history",
  auth,
  asyncHandler(async (req, res) => {
    const list = await ATSAnalysis.find({ userId: req.user?.id || null })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return res.json(list);
  })
);

// --- manual save (if needed) ---
router.post(
  "/history",
  auth,
  asyncHandler(async (req, res) => {
    const { analysis } = req.body;

    if (!analysis) {
      return res.status(400).json({ error: "analysis object is required" });
    }

    await ATSAnalysis.create({
      userId: req.user?.id || null,
      analysisId: analysis.analysisId || id(),
      atsScore: analysis.atsScore,
      metrics: analysis.metrics,
      summary: analysis.summary,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      rawResponse: analysis,
    });
    return res.json({ ok: true });
  })
);

export default router;
