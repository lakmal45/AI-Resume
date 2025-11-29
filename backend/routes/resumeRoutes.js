import express from "express";
import auth from "../middleware/auth.js";
import Resume from "../models/Resume.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const resumes = await Resume.find({ userId: req.userId });
  res.json(resumes);
});

router.post("/", auth, async (req, res) => {
  const resume = await Resume.create({ ...req.body, userId: req.userId });
  res.json(resume);
});

router.get("/:id", auth, async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.userId,
  });
  res.json(resume);
});

router.put("/:id", auth, async (req, res) => {
  const updated = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", auth, async (req, res) => {
  await Resume.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Deleted" });
});

export default router;
