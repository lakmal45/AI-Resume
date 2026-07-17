import express from "express";
import auth from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { pdfExportSchema } from "../validators/schemas.js";
import puppeteer from "puppeteer";

const router = express.Router();

let browserInstance = null;
const getBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({ 
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new"
    });
  }
  return browserInstance;
};

router.post(
  "/export",
  auth,
  validate(pdfExportSchema),
  asyncHandler(async (req, res) => {
    const { html } = req.body;

    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      // Set content and wait for Tailwind CDN to load
      await page.setContent(html, { waitUntil: ["load", "networkidle0"] });
      
      const pdf = await page.pdf({ 
        format: "A4",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        scale: 1 // ensure exact scaling
      });

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      });

      res.send(pdf);
    } finally {
      await page.close(); // Close the page, but keep browser open
    }
  })
);

export default router;
