import Fee from "../models/fee.model.js";

// 📊 Get payment report between dates
// GET /api/reports/payments?start=2025-01-01&end=2025-01-31
export const getPaymentReport = async (req, res, next) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        const payments = await Fee.find({
            status: "paid",
            updatedAt: { $gte: startDate, $lte: endDate }
        }).populate("studentId", "name rollNo");
        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (err) {
        next(err);
    }
};

// 📋 Get pending fees report
// GET /api/reports/pending
export const getPendingFees = async (req, res, next) => {
    try {
        const pendingFees = await Fee.find({ status: "unpaid" })
            .populate("studentId", "name rollNo");
        res.status(200).json({
            success: true,
            count: pendingFees.length,
            pendingFees
        });
    } catch (err) {
        next(err);
    }
};
