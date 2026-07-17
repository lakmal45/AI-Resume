import express from "express";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { createResumeSchema, updateResumeSchema } from "../validators/schemas.js";
import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";

const router = express.Router();

router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  })
);

router.post(
  "/",
  auth,
  validate(createResumeSchema),
  asyncHandler(async (req, res) => {
    const resume = await Resume.create({ ...req.body, userId: req.user.id });
    res.json(resume);
  })
);

router.get(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  })
);

router.put(
  "/:id",
  auth,
  validate(updateResumeSchema),
  asyncHandler(async (req, res) => {
    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Resume not found" });
    
    // Save version history in background (don't block the response)
    if (req.body.resumeJson || req.body.title || req.body.template) {
      ResumeVersion.saveVersion(
        updated._id,
        updated.userId,
        updated.resumeJson,
        updated.title,
        updated.template
      ).catch(err => console.error("Failed to save resume version:", err));
    }

    res.json(updated);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const result = await Resume.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Deleted" });
  })
);

// Get versions for a resume
router.get(
  "/:id/versions",
  auth,
  asyncHandler(async (req, res) => {
    // Verify ownership
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const versions = await ResumeVersion.find({ resumeId: req.params.id }).sort({ createdAt: -1 });
    res.json(versions);
  })
);

// Get a specific version
router.get(
  "/:id/versions/:versionId",
  auth,
  asyncHandler(async (req, res) => {
    const version = await ResumeVersion.findOne({
      _id: req.params.versionId,
      resumeId: req.params.id,
      userId: req.user.id
    });
    
    if (!version) return res.status(404).json({ message: "Version not found" });
    res.json(version);
  })
);

export default router;
