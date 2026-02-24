import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getRecentOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderNotifications,
  markNotificationsAsRead,
} from "../controller/ordersController.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// ---------------- USER ROUTES ----------------
orderRouter.post("/create", authToken, createOrder);
orderRouter.get("/my-orders", authToken, getMyOrders);
orderRouter.get("/notifications", authToken, getOrderNotifications);
orderRouter.put("/notifications/read", authToken, markNotificationsAsRead);
orderRouter.get("/:id", authToken, getOrderById);
orderRouter.put("/:id/cancel", authToken, cancelOrder);

// ---------------- ADMIN ROUTES ----------------
// Only accessible by admin users
orderRouter.get("/recent-orders", authToken, isAdmin, getRecentOrders);
orderRouter.get("/all-orders", authToken, isAdmin, getAllOrders);
orderRouter.put("/update-status/:orderId", authToken, isAdmin, updateOrderStatus);

export default orderRouter;