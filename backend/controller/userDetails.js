import User from '../models/userModel.js';

export const userDetails = async (req, res) => {
  try {
    // DEBUG 1: log cookies
    console.log("COOKIES:", req.cookies);

    // DEBUG 2: log userId from middleware
    console.log("req.userId:", req.userId);

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No userId found. Token missing or invalid.",
      });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details available",
      data: user,
    });
  } catch (error) {
    console.error("UserDetails error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};