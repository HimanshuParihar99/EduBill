import Fee from "../models/fee.model.js";
import User from "../models/user.model.js";
import { createRazorpayOrder } from "../services/payment.service.js";
import { generateReceipt } from "../services/pdf.service.js";
import { sendMailWithAttachment } from "../services/email.service.js";

export const assignFee = async (req, res) => {
  try {
    const { studentId, amount, dueDate } = req.body;
    if (!studentId || !amount || !dueDate) {
      return res.status(400).json({ message: "studentId, amount, and dueDate are required" });
    }
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const fee = await Fee.create({ studentId, amount, dueDate });
    res.status(201).json(fee);
  } catch (err) {
    console.error("Assign fee error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeesForStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const fees = await Fee.find({ studentId: id });
    res.json(fees);
  } catch (err) {
    console.error("Get fees error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// create razorpay order and return order details to frontend
export const createPaymentOrder = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }
    const order = await createRazorpayOrder({ amount: fee.amount, receipt: `fee_${fee._id}` });
    fee.razorpayOrderId = order.id;
    await fee.save();
    res.json({ order });
  } catch (err) {
    console.error("Create payment order error:", err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

// call this after frontend verifies payment success (or use webhook)
export const verifyAndMarkPaid = async (req, res) => {
  try {
    const { feeId, paymentId } = req.body;
    if (!feeId || !paymentId) {
      return res.status(400).json({ message: "feeId and paymentId are required" });
    }
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }
    fee.status = "paid";
    fee.paymentId = paymentId;
    await fee.save();
    const student = await User.findById(fee.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const receiptPath = await generateReceipt(student, fee);
    await sendMailWithAttachment({
      to: student.email,
      subject: "Fee Receipt",
      text: "Attached is your fee receipt.",
      attachments: [{ filename: receiptPath.split("/").pop(), path: receiptPath }]
    });
    res.json({ message: "Payment recorded and receipt sent" });
  } catch (err) {
    console.error("Verify and mark paid error:", err);
    res.status(500).json({ message: "Error marking paid" });
  }
};

// manual mark as paid (admin)
export const manualMarkPaid = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { status: "paid", paymentId: `manual_${Date.now()}` },
      { new: true }
    );
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }
    res.json(fee);
  } catch (err) {
    console.error("Manual mark paid error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unpaidReport = async (req, res) => {
  try {
    const unpaid = await Fee.find({ status: "unpaid" }).populate("studentId", "name email class rollNo");
    res.json(unpaid);
  } catch (err) {
    console.error("Unpaid report error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const monthlyCollection = async (req, res) => {
  try {
    const { year, month } = req.query; // month: 1-12
    if (!year || !month) {
      return res.status(400).json({ message: "year and month are required" });
    }
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const paid = await Fee.find({ status: "paid", updatedAt: { $gte: start, $lt: end } });
    const total = paid.reduce((s, f) => s + f.amount, 0);
    res.json({ total, count: paid.length, paid });
  } catch (err) {
    console.error("Monthly collection error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
