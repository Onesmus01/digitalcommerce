import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";

export const addToWishlist = async (req, res) => {
  try {

    const { productId } = req.body;
    const userId = req.userId; // assuming auth middleware sets this

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product id required" });
    }

    // check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // prevent duplicate wishlist
    const existing = await Wishlist.findOne({ userId, productId });

    if (existing) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      userId,
      productId
    });

    await wishlistItem.save();

    res.json({
      success: true,
      message: "Product added to wishlist"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



/* -------------------------------------------------- */


// GET USER WISHLIST
export const getWishlist = async (req, res) => {
  try {

    const userId = req.userId;

    const wishlist = await Wishlist.find({ userId })
      .populate("productId");

    res.json({
      success: true,
      data: wishlist
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ success: false, message: error.message });

  }
};



/* -------------------------------------------------- */


// REMOVE PRODUCT FROM WISHLIST
export const removeFromWishlist = async (req, res) => {

  try {

    const { productId } = req.body;
    const userId = req.userId;

    await Wishlist.findOneAndDelete({ userId, productId });

    res.json({
      success: true,
      message: "Product removed from wishlist"
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ success: false, message: error.message });

  }

};



/* -------------------------------------------------- */


// CHECK IF PRODUCT IS IN WISHLIST
export const checkWishlist = async (req, res) => {

  try {

    const { productId } = req.params;
    const userId = req.userId;

    const item = await Wishlist.findOne({ userId, productId });

    res.json({
      success: true,
      inWishlist: !!item
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ success: false, message: error.message });

  }

};



/* -------------------------------------------------- */


// CLEAR USER WISHLIST
export const clearWishlist = async (req, res) => {

  try {

    const userId = req.userId;

    await Wishlist.deleteMany({ userId });

    res.json({
      success: true,
      message: "Wishlist cleared"
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ success: false, message: error.message });

  }

};