import express from "express";
import Groq from "groq-sdk";
import auth from "../middleware/auth.js";
import multer from "multer";
import Tesseract from "tesseract.js";
import { deleteFileIfExists, deleteFolderContents } from "../utils/cleanup.js"; // ← from your file

import { extractTextHybrid } from "../utils/extractTextHybrid.js";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//const upload = multer({ dest: "uploads/jd/" });
const upload = multer({ dest: "uploads/" });

// FILE UPLOAD & TEXT EXTRACTION
/*router.post("/extract-file", auth, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file);
      text = data.text;
    }

    // Image → OCR
    else if (file.mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(file.path, "eng");
      text = result.data.text;
    }

    return res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process file" });
  }
});*/

// FILE UPLOAD & TEXT EXTRACTION
router.post("/extract-file", auth, upload.single("file"), async (req, res) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractTextHybrid(file.path, file.mimetype);

    return res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process file" });
  } finally {
    deleteFileIfExists(file.path);
    deleteFolderContents("uploads");
  }
});

// JOB SCAN ANALYSIS
router.post("/analyze", auth, async (req, res) => {
  try {
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

    const data = JSON.parse(completion.choices[0].message.content);

    return res.json(data);
  } catch (error) {
    console.error("JD Scan Error:", error);
    return res.status(500).json({ error: "Failed to analyze job description" });
  }
});

export default router;
