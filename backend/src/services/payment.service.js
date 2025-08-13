import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const isTestMode = process.env.NODE_ENV !== "production";

if (!keyId || !keySecret) {
  throw new Error("Razorpay key ID/secret not set in environment variables.");
}

const instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

export const createRazorpayOrder = async ({ amount, receipt }) => {
  if (!amount || !receipt) {
    throw new Error("Amount and receipt are required to create a Razorpay order");
  }
  try {
    // Razorpay amounts are in paise
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes: isTestMode ? { test: "true" } : undefined
    });
    return order;
  } catch (err) {
    console.error("Razorpay order creation error:", err?.error || err);
    throw new Error(err?.error?.description || "Failed to create Razorpay order");
  }
};
