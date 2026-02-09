import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    phone: { type: String }, // only for M-Pesa
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["idle", "pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    transaction: { type: String, required: true, unique: true }, // CheckoutRequestID or manual ref
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
