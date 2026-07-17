import express from "express";
import JobApplication from "../models/JobApplication.js";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

// GET all user's job applications
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const jobs = await JobApplication.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  })
);

// POST a new job application
router.post(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const newJob = new JobApplication({
      ...req.body,
      userId: req.user.id,
    });
    const savedJob = await newJob.save();
    res.json(savedJob);
  })
);

// PUT update an existing job application
router.put(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const updatedJob = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ error: "Job application not found" });
    res.json(updatedJob);
  })
);

// DELETE a job application
router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const deletedJob = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedJob) return res.status(404).json({ error: "Job application not found" });
    res.json({ success: true, message: "Job application deleted" });
  })
);

export default router;
