// backend/routes/projectRoutes.js
import express from "express";
import authMiddleware, { authenticateOptional } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import {
  submitProject,
  getPendingProjects,
  validateProject,
  rejectProject,
  getProjectById,
  getMyPurchasedProjects,
  getAllProjects,
  getAllProjectsWithStats,
  getMyProjects,
  getMyAllProjects,
  getRejectedProjects,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// ============================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================

// Default route - get all validated projects
router.get("/", authenticateOptional, getAllProjects);

// Get all validated projects (alias for /)
router.get("/all", authenticateOptional, getAllProjectsWithStats);

// ============================================
// AUTHENTICATED ENDPOINTS (Auth Required)
// ============================================
// ⚠️ CRITICAL: SPECIFIC ROUTES MUST COME BEFORE "/:id"

// Submit new project (with file upload)
router.post(
  "/submit",
  authMiddleware,
  upload.fields([
    { name: "dokumen", maxCount: 1 },
    { name: "gambarProyek", maxCount: 10 },
  ]),
  submitProject
);

// ✅ Get user's own projects (simple) - BEFORE /:id
router.get("/mine", authMiddleware, getMyProjects);

// ✅ Get user's own projects (all, including sold) - BEFORE /:id
router.get("/mine-all", authMiddleware, getMyAllProjects);

// ✅ Get user's purchased projects - BEFORE /:id
router.get("/purchased", authMiddleware, getMyPurchasedProjects);

// ============================================
// REGULATOR ENDPOINTS - BEFORE /:id
// ============================================

// Get pending projects (awaiting validation)
router.get("/regulator/pending-projects", authMiddleware, getPendingProjects);

// Get rejected projects
router.get("/regulator/rejected-projects", authMiddleware, getRejectedProjects);

// Validate project (issue certificate)
router.post("/regulator/validate-project", authMiddleware, validateProject);

// Reject project
router.post("/regulator/reject-project", authMiddleware, rejectProject);

// ============================================
// UPDATE & DELETE - BEFORE /:id
// ============================================

// Update project
router.put("/:id", authMiddleware, updateProject);

// Delete project
router.delete("/:id", authMiddleware, deleteProject);

// ============================================
// DYNAMIC ROUTE (MUST BE LAST!)
// ============================================

// ✅ Get project by ID (public + auth optional)
// ⚠️ MUST BE LAST because it matches any "/:id"
router.get("/:id", authenticateOptional, getProjectById);

export default router;