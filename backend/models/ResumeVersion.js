import mongoose from "mongoose";

const ResumeVersionSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeJson: { type: String, required: true },
  title: { type: String },
  template: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Clean up old versions if there are too many (e.g. keep max 20 versions per resume)
ResumeVersionSchema.statics.saveVersion = async function (resumeId, userId, resumeJson, title, template) {
  // Save new version
  const newVersion = await this.create({
    resumeId,
    userId,
    resumeJson,
    title,
    template
  });

  // Prune old versions (keep last 15)
  const versions = await this.find({ resumeId }).sort({ createdAt: -1 });
  if (versions.length > 15) {
    const idsToDelete = versions.slice(15).map(v => v._id);
    await this.deleteMany({ _id: { $in: idsToDelete } });
  }

  return newVersion;
};

export default mongoose.model("ResumeVersion", ResumeVersionSchema);
