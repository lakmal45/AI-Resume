import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import pdfRoutes from "./routes/pdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
console.log("Loaded GROQ key:", process.env.GROQ_API_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdf", pdfRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on ${PORT}`));
