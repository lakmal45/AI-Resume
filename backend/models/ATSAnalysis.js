import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String, // keyword|formatting|grammar|metrics|other
  impact: String, // Low|Medium|High
  explanation: String,
  proposedChange: mongoose.Schema.Types.Mixed,
  target: mongoose.Schema.Types.Mixed,
});

const ATSAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sourceType: {
      type: String,
      enum: ["resume", "upload", "manual"],
      default: "manual",
    },
    sourceRef: { type: String }, // resumeId or filename or other reference
    analysisId: { type: String, required: true },
    atsScore: Number,
    metrics: {
      keywordMatch: Number,
      formattingIssuesScore: Number,
      grammarIssuesScore: Number,
    },
    summary: String,
    missingKeywords: [String],
    formattingIssues: [String],
    grammarSuggestions: [String],
    suggestions: [SuggestionSchema],
    rawResponse: mongoose.Schema.Types.Mixed, // full AI JSON
  },
  { timestamps: true }
);

export default mongoose.model("ATSAnalysis", ATSAnalysisSchema);
