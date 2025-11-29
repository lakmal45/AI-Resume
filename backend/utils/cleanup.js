import fs from "fs";
import path from "path";

export function deleteFileIfExists(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Deleted:", filePath);
    }
  } catch (err) {
    console.error("Failed to delete file:", filePath, err);
  }
}

export function deleteFolderContents(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        deleteFolderContents(fullPath);
        fs.rmdirSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    }
    console.log("Cleaned folder:", folderPath);
  } catch (err) {
    console.error("Failed to clean folder:", folderPath, err);
  }
}

export function deleteFolderAndContents(folderPath) {
  deleteFolderContents(folderPath);
  try {
    if (fs.existsSync(folderPath)) fs.rmdirSync(folderPath);
  } catch (err) {
    console.error("Failed to delete folder:", folderPath, err);
  }
}
