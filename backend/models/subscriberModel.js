import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
  preferences: {
    promotions: { type: Boolean, default: true },
    newProducts: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true }
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);