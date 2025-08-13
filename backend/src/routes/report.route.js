import express from "express";
import { getPaymentReport, getPendingFees } from "../controllers/report.controller.js";

const router = express.Router();

// Middleware placeholder for future authentication/authorization
// import { protect, adminOnly } from "../middleware/auth.middleware.js";
// router.use(protect);

/**
 * @route GET /api/reports/payments?start=YYYY-MM-DD&end=YYYY-MM-DD
 * @desc Get payment report between dates
 */
router.get("/payments", (req, res, next) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates are required" });
    }
    next();
}, getPaymentReport);

/**
 * @route GET /api/reports/pending
 * @desc Get pending fees report
 */
router.get("/pending", getPendingFees);

export default router;
