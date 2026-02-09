import mongoose from "mongoose";

const mpesaLogSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      index: true, // easy to search by transaction
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    payload: {
      type: Object, // store full M-Pesa webhook payload
      required: true,
    },
    notes: {
      type: String, // optional field for extra info
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("MpesaLog", mpesaLogSchema);
