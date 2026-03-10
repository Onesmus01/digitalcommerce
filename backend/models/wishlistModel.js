import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
{
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }

},
{ timestamps: true }
);

// Prevent duplicate wishlist items
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;