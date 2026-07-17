import express from "express";
import Groq from "groq-sdk";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { jobScanAnalyzeSchema } from "../validators/schemas.js";
import multer from "multer";
import { deleteFileIfExists, deleteFolderContents } from "../utils/cleanup.js";
import { extractTextHybrid } from "../utils/extractTextHybrid.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// FILE UPLOAD & TEXT EXTRACTION
router.post(
  "/extract-file",
  auth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;

    try {
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      const text = await extractTextHybrid(file.path, file.mimetype);

      return res.json({ text });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process file" });
    } finally {
      if (file?.path) deleteFileIfExists(file.path);
      deleteFolderContents("uploads");
    }
  })
);

// JOB SCAN ANALYSIS
router.post(
  "/analyze",
  auth,
  validate(jobScanAnalyzeSchema),
  asyncHandler(async (req, res) => {
    const { jdText, selectedResumeJson } = req.body;

    const resumeData = selectedResumeJson ? selectedResumeJson : {};

    const prompt = `
You are an AI Job Description Scanner.
Extract structured data strictly in valid JSON.

--- JOB DESCRIPTION ---
${jdText}

--- USER RESUME JSON ---
${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON in this structure:

{
  "skills": [],
  "responsibilities": [],
  "keywords": [],
  "missingSkills": [],
  "updatedSummary": "",
  "updatedBullets": [],
  "matchScore": 0
}

Rules:
• Extract only relevant skills from JD  
• Compare extracted skills with USER RESUME JSON  
• missingSkills = skills from JD not in resume  
• updatedSummary = rewrite resume summary to match JD  
• updatedBullets = rewrite resume experience bullets  
• If resume is empty → treat as NEW resume  
• matchScore = percentage match  
• Do NOT add explanations. JSON only.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    let data;
    try {
      data = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(502).json({ error: "AI returned invalid JSON. Please try again." });
    }

    return res.json(data);
  })
);

export default router;
