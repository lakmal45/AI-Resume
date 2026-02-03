import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

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

dotenv.config();
console.log("Loaded GROQ key:", process.env.GROQ_API_KEY);

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/jobscan", jobscanRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/interview", interviewRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "AI Resume Builder API Running" });
});

app.listen(PORT, () => console.log(`✅ Backend running on ${PORT}`));

cron.schedule("0 3 * * *", () => {
  console.log("Running daily cleanup...");
  deleteFolderContents("uploads");
  deleteFolderContents("uploads/pdf_images");
});
