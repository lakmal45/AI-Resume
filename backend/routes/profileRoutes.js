import express from "express";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import User from "../models/User.js";

const router = express.Router();

// Get current user profile
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  })
);

// Update profile
router.put(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const { name, phone, location, title, bio, socialLinks } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (title !== undefined) user.title = title;
    if (bio !== undefined) user.bio = bio;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  })
);

export default router;
