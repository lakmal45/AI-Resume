import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  jobUrl: { type: String },
  status: { 
    type: String, 
    enum: ["Applied", "Screening", "Interview", "Offer", "Rejected"], 
    default: "Applied" 
  },
  resumeId: { type: String },
  coverLetterId: { type: String },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
  nextAction: { type: String },
  nextActionDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("JobApplication", JobApplicationSchema);
