import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  location: String,
  title: String,
  bio: String,
  avatar: String,
  socialLinks: {
    linkedin: String,
    github: String,
    website: String,
  },
  preferences: {
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    defaultTemplate: { type: String, default: "Minimal" },
    emailNotifications: { type: Boolean, default: true },
    language: { type: String, default: "en" },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
