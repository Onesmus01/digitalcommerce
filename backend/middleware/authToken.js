import jwt from "jsonwebtoken";

const authToken = async (req, res, next) => {
  try {
    // Grab token from cookie or Authorization header
    const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({   // <-- 401 for unauthorized
        success: false,
        message: "Unauthorized: Please login",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extra safety check
    if (!decodedToken?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    req.userId = decodedToken._id;
    req.role = decodedToken.role;  // Save role too
    req.email = decodedToken.email;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default authToken;