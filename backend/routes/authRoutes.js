import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/schemas.js";

const router = express.Router();

// -----------------------------------------------------------------------------
// TOKEN HELPERS
// -----------------------------------------------------------------------------
const createAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const createRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// Cookie options (supports localhost + production)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true only in HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// -----------------------------------------------------------------------------
// REGISTER — validated with Zod (name, email, password complexity)
// -----------------------------------------------------------------------------
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------------------------
// LOGIN — validated with Zod (email, password)
// -----------------------------------------------------------------------------
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------------------------
// REFRESH ACCESS TOKEN
// -----------------------------------------------------------------------------
router.get("/refresh-token", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res.status(401).json({ message: "No refresh token found" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const accessToken = createAccessToken(decoded.id);

    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// -----------------------------------------------------------------------------
// LOGOUT
// -----------------------------------------------------------------------------
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.json({ message: "Logged out" });
});

export default router;
