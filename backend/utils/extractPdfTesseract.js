import { createWorker } from "tesseract.js";
import PDFPoppler from "pdf-poppler";
import fs from "fs";
import path from "path";

export async function extractPdfTesseract(pdfPath) {
  const outputDir = path.join("uploads", "pdf_images");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const baseName = Date.now().toString();

  // 1) Convert each page of PDF → PNG image
  const opts = {
    format: "png",
    out_dir: outputDir,
    out_prefix: baseName,
    page: null,
  };

  await PDFPoppler.convert(pdfPath, opts);

  // Find generated PNG files
  const images = fs
    .readdirSync(outputDir)
    .filter((f) => f.startsWith(baseName) && f.endsWith(".png"))
    .map((f) => path.join(outputDir, f));

  if (images.length === 0) {
    throw new Error("Failed to convert PDF to images");
  }

  // 2) OCR each page
  const worker = await createWorker("eng");
  let fullText = "";

  for (const imgPath of images) {
    const { data } = await worker.recognize(imgPath);
    fullText += data.text + "\n";
  }

  await worker.terminate();

  return fullText.trim();
}
