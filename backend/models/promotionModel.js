import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discount: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true
  },
  link: {
    type: String,
    default: "https://digitalcommerce.com/sale"
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  broadcastAt: {
    type: Date,
    default: Date.now
  },
  recipientCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model("Promotion", promotionSchema);