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

const orderRouter = express.Router();

orderRouter.post("/create", authToken, createOrder);
orderRouter.get("/my-orders", authToken, getMyOrders);
orderRouter.get("/recent-orders",authToken,getRecentOrders)
orderRouter.get("/all-orders", authToken, getAllOrders);
orderRouter.get("/notifications",authToken, getOrderNotifications);
orderRouter.put("/notifications/read", markNotificationsAsRead);
orderRouter.get("/:id", authToken, getOrderById);
orderRouter.put("/:id/cancel", authToken, cancelOrder);
orderRouter.put("/update-status/:orderId", authToken, updateOrderStatus);

export default orderRouter;
