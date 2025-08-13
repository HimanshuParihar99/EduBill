import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be positive"]
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: v => v instanceof Date && !isNaN(v),
      message: "Invalid due date"
    }
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
    index: true
  },
  paymentId: {
    type: String,
    trim: true,
    default: null
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

feeSchema.index({ studentId: 1, dueDate: -1 });

export default mongoose.model("Fee", feeSchema);
