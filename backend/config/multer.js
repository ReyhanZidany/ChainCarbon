// config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(process.cwd(), "uploads", "projects");
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    cb(null, base);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safe = file.fieldname + "-" + Date.now() + ext;
    cb(null, safe);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
