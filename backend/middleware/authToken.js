import jwt from "jsonwebtoken";

const authToken = async (req, res, next) => {
  try {
    let token;

    // 🔥 ENHANCED DEBUG - Log everything
    console.log("========== AUTH DEBUG ==========");
    console.log("🔹 Request Method:", req.method);
    console.log("🔹 Request URL:", req.originalUrl);
    console.log("🔹 Request Origin:", req.headers.origin);
    console.log("🔹 NODE_ENV:", process.env.NODE_ENV);
    
    // Check all possible header variations (case sensitivity)
    console.log("🔹 All Headers:", JSON.stringify(req.headers, null, 2));
    
    // Specifically check for authorization (various cases)
    console.log("🔹 req.headers.authorization:", req.headers.authorization);
    console.log("🔹 req.headers.Authorization:", req.headers.Authorization);
    console.log("🔹 req.headers?.authorization:", req.headers?.authorization);

    // Check cookies in detail
    console.log("🔹 req.cookies:", req.cookies);
    console.log("🔹 req.cookies?.token:", req.cookies?.token);
    console.log("🔹 Cookie header raw:", req.headers.cookie);
    console.log("================================");

    // 1️⃣ Check Authorization header first (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ Token found in header:", token.substring(0, 20) + "...");
    }

    // 2️⃣ Fallback → Check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("✅ Token found in cookies:", token.substring(0, 20) + "...");
    }

    // ❌ No token found
    if (!token) {
      console.warn("❌ FINAL: No token found in header or cookies");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login",
        debug: process.env.NODE_ENV !== "production" ? {
          hasAuthHeader: !!authHeader,
          authHeaderPrefix: authHeader ? authHeader.substring(0, 20) : null,
          hasCookies: !!req.cookies,
          cookieNames: req.cookies ? Object.keys(req.cookies) : [],
        } : undefined,
      });
    }

    // 3️⃣ Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", {
        _id: decodedToken._id,
        email: decodedToken.email,
        role: decodedToken.role,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      });
    } catch (verifyError) {
      console.error("❌ JWT verification failed:", verifyError.message);
      console.error("❌ Token that failed:", token.substring(0, 30) + "...");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // ❌ Invalid payload
    if (!decodedToken || !decodedToken._id) {
      console.warn("❌ Invalid token payload - missing _id:", decodedToken);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    // ✅ Attach user info
    req.userId = decodedToken._id;
    req.role = decodedToken.role;
    req.email = decodedToken.email;

    console.log("✅ SUCCESS: Authenticated user:", { 
      id: req.userId, 
      role: req.role, 
      email: req.email 
    });

    next();
  } catch (error) {
    console.error("❌ CRITICAL Auth error:", error);
    console.error("❌ Error stack:", error.stack);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authToken;