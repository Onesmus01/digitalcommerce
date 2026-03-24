import mongoose from 'mongoose';
// ===================== HOT DEAL SCHEMA =====================
const hotDealSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  discountPercent: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [99, 'Discount cannot exceed 99%']
  },
  dealType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
hotDealSchema.index({ isActive: 1, endTime: 1 });
hotDealSchema.index({ productId: 1 });

// Pre-save middleware to update updatedAt
hotDealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for calculating discounted price
hotDealSchema.virtual('discountedPrice').get(function() {
  if (this.productId && this.productId.price) {
    return Math.round(this.productId.price * (1 - this.discountPercent / 100));
  }
  return 0;
});

// Virtual for time remaining
hotDealSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endTime);
  const diff = end - now;

  if (diff <= 0) return 0;

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
});

const HotDeal = mongoose.model('HotDeal', hotDealSchema);

export default HotDeal;
