import multer from "multer";
import path from "path";

// Storage dokumen PDF
const storageDocs = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/docs"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// Storage gambar
const storageImages = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const uploadDoc = multer({
  storage: storageDocs,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed!"), false);
  },
});

export const uploadImages = multer({
  storage: storageImages,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed!"), false);
  },
});
