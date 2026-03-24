import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cookie from "cookie";

import connectDb from "./config/db.js";
import { initSocket } from "./soket.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import personalDetailsRouter from "./routes/personalDetailsRoutes.js";
import paymentRouter from "./routes/paymentRoute.js";
import salesProgressRoute from "./routes/salesProgressRoute.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import hotDealRouter from "./routes/hotDealsRoute.js";
import revenueRouter from "./routes/revenueRoute.js";
import reportsRouter from "./routes/reportsRoute.js";
import settingsRouter from "./routes/settingsRoute.js";
dotenv.config();


// ---------------- DATABASE ----------------
connectDb();


// ---------------- EXPRESS APP ----------------
const app = express();
const server = http.createServer(app);


// ---------------- CORS ----------------
const allowedOrigins = ["http://localhost:5173","https://digitalcommerce-whua.onrender.com"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// ---------------- API ROUTES ----------------
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/personal-details", personalDetailsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/sales-progress", salesProgressRoute);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/hot-deals", hotDealRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/settings", settingsRouter);



// ---------------- SOCKET.IO ----------------
const io = initSocket(server, allowedOrigins);


// ---------------- SOCKET AUTH ----------------
io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Unauthorized: No cookies"));
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded._id;
    socket.role = decoded.role;
    socket.email = decoded.email;

    console.log("✅ Socket authenticated:", decoded.email);

    next();
  } catch (error) {
    console.error("❌ Socket auth error:", error.message);
    next(new Error("Invalid or expired token"));
  }
});


// ---------------- ONLINE ADMINS TRACKER ----------------
const onlineAdmins = new Set();


// ---------------- SOCKET CONNECTION ----------------
io.on("connection", (socket) => {

  console.log("🟢 User connected:", socket.userId);

  // 🔔 Join personal user room
  socket.join(socket.userId);
  console.log(`👤 User ${socket.userId} joined personal room`);

  // 👑 Admin room
  if (socket.role?.toLowerCase() === "admin") {
    socket.join("admins");

    onlineAdmins.add(socket.id);

    io.to("admins").emit("admins-online", onlineAdmins.size);

    console.log(`👑 Admin ${socket.userId} joined admins room`);
  }


  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", (reason) => {

    if (socket.role?.toLowerCase() === "admin") {
      onlineAdmins.delete(socket.id);

      io.to("admins").emit("admins-online", onlineAdmins.size);
    }

    console.log("🔴 User disconnected:", socket.id, "reason:", reason);
  });


  // ---------------- SOCKET ERRORS ----------------
  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err.message);
  });

});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});