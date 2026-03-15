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
  getTotalOrders,
  addProductUserNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controller/ordersController.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// ---------------- USER ROUTES ----------------
orderRouter.post("/create", authToken, createOrder);
orderRouter.get("/my-orders", authToken, getMyOrders);
orderRouter.get("/notifications", authToken, getOrderNotifications);
orderRouter.put("/notifications/read", authToken, markNotificationsAsRead);
orderRouter.get("/user-notifications", authToken, getUserNotifications);
orderRouter.put("/notifications/:notificationId/read", authToken, markNotificationAsRead);
orderRouter.put("/notifications/read-all", authToken, markAllNotificationsAsRead);
orderRouter.get("/recent-orders", authToken, getRecentOrders);
orderRouter.get("/all-orders", authToken,  getAllOrders);
orderRouter.get("/total-orders", authToken, getTotalOrders);
orderRouter.get("/:id", authToken, getOrderById);
orderRouter.put("/:id/cancel", authToken, cancelOrder);

// ---------------- ADMIN ROUTES ----------------
// Only accessible by admin users

orderRouter.put("/update-status/:orderId", authToken, updateOrderStatus);

export default orderRouter;