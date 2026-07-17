import express from "express";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import User from "../models/User.js";

const router = express.Router();

// Get settings
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("preferences");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.preferences || {});
  })
);

// Update settings
router.put(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const preferences = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json(user.preferences);
  })
);

// Delete account
router.delete(
  "/account",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Ideally we would also delete their resumes and cover letters here
    await user.deleteOne();
    
    res.json({ message: "Account deleted successfully" });
  })
);

export default router;
