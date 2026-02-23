import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controller/ordersController.js";
import authToken from "../middleware/authToken.js";

const orderRouter = express.Router();

orderRouter.post("/create", authToken, createOrder);
orderRouter.get("/my-orders", authToken, getMyOrders);
orderRouter.get("/:id", authToken, getOrderById);
orderRouter.put("/:id/cancel", authToken, cancelOrder);
export default orderRouter;
