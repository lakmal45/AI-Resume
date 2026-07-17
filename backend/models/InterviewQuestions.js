import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resumeId: { type: String, required: true },
  role: { type: String },
  questions: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("InterviewQuestions", InterviewSchema);
