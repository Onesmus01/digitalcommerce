import jwt from "jsonwebtoken";

const authToken = async (req, res, next) => {
  try {
    let token;

    console.log("🔹 Headers:", req.headers);
    console.log("🔹 Cookies:", req.cookies);

    // 1️⃣ Check Authorization header first
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("🔹 Token found in header:", token);
    }

    // 2️⃣ Fallback → Check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("🔹 Token found in cookies:", token);
    }

    // ❌ No token found
    if (!token) {
      console.warn("❌ No token found in header or cookies");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login",
      });
    }

    // 3️⃣ Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 Token decoded:", decodedToken);
    } catch (verifyError) {
      console.error("❌ JWT verification failed:", verifyError.message);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // ❌ Invalid payload
    if (!decodedToken || !decodedToken._id) {
      console.warn("❌ Invalid token payload:", decodedToken);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // ✅ Attach user info
    req.userId = decodedToken._id;
    req.role = decodedToken.role;
    req.email = decodedToken.email;

    console.log("✅ Authenticated user:", { id: req.userId, role: req.role, email: req.email });

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authToken;