import express from "express";
import auth from "../middleware/auth.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

router.post("/generate-summary", auth, async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a resume writer" },
      { role: "user", content: prompt },
    ],
  });

  res.json({ summary: completion.choices[0].message.content.trim() });
});

export default router;
