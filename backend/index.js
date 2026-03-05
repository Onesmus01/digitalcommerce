import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cookie from "cookie";

import connectDb from "./config/db.js";
import { initSocket, getIO } from "./soket.js"; // Import from socket.js

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import personalDetailsRouter from "./routes/personalDetailsRoutes.js";
import paymentRouter from "./routes/paymentRoute.js";
import salesProgressRoute from "./routes/salesProgressRoute.js";

dotenv.config();
// ---------------- DATABASE ----------------
connectDb();

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:5173"];

// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



// ---------------- ROUTES ----------------
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/personal-details", personalDetailsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/sales-progress", salesProgressRoute);
// ---------------- SOCKET.IO ----------------
const io = initSocket(server, allowedOrigins);

// Socket authentication
io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("Unauthorized"));

    const parsed = cookie.parse(cookies);
    const token = parsed.token;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded._id;
    socket.role = decoded.role;
    console.log("✅ Socket authenticated:", decoded.email);

    next();
  } catch (err) {
    console.error("❌ Socket auth error:", err.message);
    next(new Error("Invalid or expired token"));
  }
});

// Track online admins
const onlineAdmins = new Set();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.userId);

  if (socket.role?.toLowerCase() === "admin") {
    socket.join("admins");
    onlineAdmins.add(socket.id);
    io.to("admins").emit("admins-online", onlineAdmins.size);
    console.log(`👑 Admin ${socket.userId} joined admins room`);
  }

  socket.on("disconnect", (reason) => {
    if (socket.role?.toLowerCase() === "admin") {
      onlineAdmins.delete(socket.id);
      io.to("admins").emit("admins-online", onlineAdmins.size);
    }
    console.log("🔴 User disconnected:", socket.id, "reason:", reason);
  });

  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err.message);
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});