import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  jobDescription: { type: String, required: true },
  content: { type: String, required: true },
  tone: { type: String, default: "professional" }, // professional, friendly, formal
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CoverLetter", CoverLetterSchema);
