// backend/routes/transactionRoutes.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getMyTransactions,
  getTransactionDetail,
  getTransactionStats,
  getAllTransactions,
  exportTransactions,
  createTransaction,
} from "../controllers/transactionController.js";
import { getRecentTransactionsPublic } from "../controllers/transactionController.js";

const router = express.Router();

// ============================================
// Transaction Routes
// Order matters: specific routes before dynamic routes
// ============================================

router.get("/my-transactions", auth, getMyTransactions);
router.get("/stats", auth, getTransactionStats);
router.get("/export", auth, exportTransactions);
router.post("/create", auth, createTransaction);
router.get("/", auth, getAllTransactions);

// PUBLIC recent transactions (should be BEFORE :txId)
router.get("/recent", getRecentTransactionsPublic);

// Dynamic route MUST be last
router.get("/:txId", auth, getTransactionDetail);


export default router;