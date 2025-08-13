import express from "express";
import {
  assignFee,
  getFeesForStudent,
  createPaymentOrder,
  verifyAndMarkPaid,
  manualMarkPaid,
  unpaidReport,
  monthlyCollection
} from "../controllers/fee.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, assignFee);
router.get("/student/:id", protect, getFeesForStudent);

// payment flow: create order (student or admin)
router.post("/create-order/:id", protect, createPaymentOrder);

// after payment success, frontend posts paymentId + feeId
router.post("/verify-pay", protect, verifyAndMarkPaid);

// admin manual mark
router.put("/:id/manual-pay", protect, adminOnly, manualMarkPaid);

// reports
router.get("/reports/unpaid", protect, adminOnly, unpaidReport);
router.get("/reports/monthly", protect, adminOnly, monthlyCollection);

export default router;
