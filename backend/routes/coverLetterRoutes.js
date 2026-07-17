import express from "express";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { coverLetterGenerateSchema, coverLetterSaveSchema } from "../validators/schemas.js";
import Resume from "../models/Resume.js";
import CoverLetter from "../models/CoverLetter.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Generate a Cover Letter
router.post(
  "/generate",
  auth,
  validate(coverLetterGenerateSchema),
  asyncHandler(async (req, res) => {
    const { resumeId, jobDescription, tone } = req.body;
    const userId = req.user.id;

    // Fetch the resume to provide context
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    // Build the prompt for Groq
    const prompt = `
      You are an expert career coach and cover letter writer.
      Generate a customized cover letter for the provided job description, using the applicant's resume for background and experience.
      
      Job Description:
      ${jobDescription}

      Applicant Resume Data (JSON format):
      ${resume.resumeJson}

      Guidelines:
      1. Write in a ${tone || "professional"} tone.
      2. Do not include placeholder brackets like [Your Name] if the information is available in the resume data.
      3. Keep it concise, engaging, and directly focused on how the applicant's skills solve the employer's needs.
      4. Format the output with clear paragraphs. Do NOT wrap the output in markdown code blocks. Just output the text.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: GROQ_MODEL,
        temperature: 0.7,
      });

      let content = completion.choices[0]?.message?.content || "";
      
      // Clean up any potential markdown wrapper
      content = content.replace(/^```[a-z]*\n/gi, '').replace(/\n```$/g, '').trim();

      res.json({ content });
    } catch (error) {
      console.error("Groq API error:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  })
);

// Save a Cover Letter
router.post(
  "/",
  auth,
  validate(coverLetterSaveSchema),
  asyncHandler(async (req, res) => {
    const { resumeId, jobDescription, content, tone } = req.body;
    const userId = req.user.id;

    const coverLetter = await CoverLetter.create({
      userId,
      resumeId: resumeId || undefined,
      jobDescription,
      content,
      tone: tone || "professional"
    });

    res.status(201).json(coverLetter);
  })
);

// Get User's Cover Letters
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const letters = await CoverLetter.find({ userId }).sort({ createdAt: -1 });
    res.json(letters);
  })
);

// Get a Specific Cover Letter
router.get(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const letter = await CoverLetter.findOne({ _id: req.params.id, userId });
    
    if (!letter) return res.status(404).json({ message: "Cover letter not found" });
    
    res.json(letter);
  })
);

// Delete a Cover Letter
router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const letter = await CoverLetter.findOneAndDelete({ _id: req.params.id, userId });
    
    if (!letter) return res.status(404).json({ message: "Cover letter not found" });
    
    res.json({ message: "Cover letter deleted" });
  })
);

export default router;
