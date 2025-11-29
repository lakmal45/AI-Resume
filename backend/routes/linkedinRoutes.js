import express from "express";
import multer from "multer";
import fs from "fs";
import Resume from "../models/Resume.js";
import auth from "../middleware/auth.js";
import Groq from "groq-sdk";
import { extractPdfTesseract } from "../utils/extractPdfTesseract.js";
import { deleteFileIfExists, deleteFolderContents } from "../utils/cleanup.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const IMAGE_OUTPUT_FOLDER = "uploads/pdf_images";

const RESUME_SCHEMA = `{
  "header": { "name": "", "role": "", "email": "", "phone": "" },
  "summary": "",
  "skills": [],
  "experience": [ { "role": "", "company": "", "bullets": [] } ],
  "projects": [],
  "education": []
}`;

router.post("/import", auth, upload.single("pdf"), async (req, res) => {
  const pdfPath = req.file.path;

  try {
    const extractedText = await extractPdfTesseract(pdfPath);

    if (!extractedText || extractedText.length < 20) {
      throw new Error("OCR returned very little text.");
    }

    const prompt = `
You MUST return ONLY valid JSON.
Convert the following extracted resume text into JSON:

${extractedText}

Use this schema:
${RESUME_SCHEMA}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
    });

    const raw = completion.choices[0].message.content;
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({
        success: false,
        error: "Groq did not return JSON",
        raw,
      });
    }

    const cleanJson = match[0].replace(/```json/gi, "").replace(/```/g, "");

    const resumeJson = JSON.parse(cleanJson);

    const newResume = await Resume.create({
      userId: req.userId,
      title: `${resumeJson.header.name || "LinkedIn"} Resume`,
      template: "Modern",
      resumeJson: JSON.stringify(resumeJson),
      source: "linkedin",
    });

    res.json({ success: true, data: newResume });
  } catch (err) {
    console.error("LinkedIn Import Error:", err);
    res.status(500).json({
      success: false,
      message: "LinkedIn PDF import failed.",
    });
  } finally {
    // Always delete the PDF
    deleteFileIfExists(pdfPath);

    // Always delete generated images
    deleteFolderContents(IMAGE_OUTPUT_FOLDER);
  }
});

export default router;
