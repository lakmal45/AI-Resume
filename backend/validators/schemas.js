import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be under 128 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// ─── Resume Schemas ──────────────────────────────────────────────────────────

export const createResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  template: z.string().trim().optional(),
  resumeJson: z.string().optional(),
  source: z.enum(["manual", "linkedin"]).optional().default("manual"),
});

export const updateResumeSchema = createResumeSchema.partial();

// ─── AI / ATS Schemas ────────────────────────────────────────────────────────

export const generateSummarySchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .trim()
    .min(10, "Prompt must be at least 10 characters")
    .max(5000, "Prompt must be under 5000 characters"),
});

export const generateSkillsSchema = z.object({
  keywords: z
    .string({ required_error: "Keywords are required" })
    .trim()
    .min(2, "Keywords must be at least 2 characters")
    .max(2000, "Keywords must be under 2000 characters"),
  role: z.string().trim().max(200).optional(),
});

export const generateExperienceSchema = z.object({
  role: z.string().trim().max(200).optional().default(""),
  company: z.string().trim().max(200).optional().default(""),
  tech: z.string().trim().max(1000).optional().default(""),
  notes: z.string().trim().max(3000).optional().default(""),
});

export const atsCheckSchema = z.object({
  resumeText: z
    .string({ required_error: "Resume text is required" })
    .trim()
    .min(20, "Resume text is too short")
    .max(20000, "Resume text must be under 20,000 characters"),
  jobDescription: z
    .string({ required_error: "Job description is required" })
    .trim()
    .min(20, "Job description is too short")
    .max(20000, "Job description must be under 20,000 characters"),
});

export const generateFullSchema = z.object({
  keywords: z
    .string({ required_error: "Keywords are required" })
    .trim()
    .min(5, "Keywords must be at least 5 characters")
    .max(5000, "Keywords must be under 5000 characters"),
  targetRole: z.string().trim().max(200).optional(),
});

export const atsAnalyzeSchema = z.object({
  resume: z.any().refine((val) => val !== null && val !== undefined, {
    message: "Resume data is required",
  }),
  jobDescription: z.string().max(20000).optional().default(""),
});

export const jobScanAnalyzeSchema = z.object({
  jdText: z
    .string({ required_error: "Job description text is required" })
    .trim()
    .min(20, "Job description is too short")
    .max(20000, "Job description must be under 20,000 characters"),
  selectedResumeJson: z.any().optional(),
});

export const interviewGenerateSchema = z.object({
  resumeId: z.string({ required_error: "Resume ID is required" }),
  jobUrl: z.string().url().optional(),
});

export const coverLetterGenerateSchema = z.object({
  resumeId: z.string({ required_error: "Resume ID is required" }),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  tone: z.enum(["professional", "friendly", "formal"]).optional(),
});

export const coverLetterSaveSchema = z.object({
  resumeId: z.string().optional(),
  jobDescription: z.string(),
  content: z.string().min(10, "Content cannot be empty"),
  tone: z.string().optional(),
});

export const pdfExportSchema = z.object({
  html: z
    .string({ required_error: "HTML content is required" })
    .min(10, "HTML content is too short")
    .max(500000, "HTML content is too large"),
});
