import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  template: String,
  resumeJson: String,
  source: {
    type: String,
    enum: ["manual", "linkedin"],
    default: "manual",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", ResumeSchema);
