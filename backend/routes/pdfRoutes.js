import express from "express";
import auth from "../middleware/auth.js";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/export", auth, async (req, res) => {
  const { html } = req.body;

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=resume.pdf",
  });

  res.send(pdf);
});

export default router;
