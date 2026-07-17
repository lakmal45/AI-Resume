import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import pdfRoutes from "./routes/pdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import linkedinRoutes from "./routes/linkedinRoutes.js";
import cron from "node-cron";
import { deleteFolderContents } from "./utils/cleanup.js";
import jobscanRoutes from "./routes/jobscanRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import coverLetterRoutes from "./routes/coverLetterRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";

dotenv.config();

const app = express();

// ─── CORS Middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Security Middleware ───────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// General rate limiter — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use(generalLimiter);

// Stricter limiter for auth routes — 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

app.use("/auth", authLimiter, authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/jobscan", jobscanRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/jobs", jobApplicationRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "AI Resume Builder API Running" });
});

// ─── 404 Handler — catch undefined routes ─────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
// Must have 4 params so Express recognises it as an error handler
app.use((err, req, res, _next) => {
  // Log full error in dev; keep it terse in prod
  console.error("❌ Unhandled Error:", err.stack || err);

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({ message });
});

const server = app.listen(PORT, () => console.log(`✅ Backend running on ${PORT}`));

cron.schedule("0 3 * * *", () => {
  console.log("Running daily cleanup...");
  deleteFolderContents("uploads");
  deleteFolderContents("uploads/pdf_images");
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


