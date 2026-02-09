import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controller/ordersController.js";
import authToken from "../middleware/authToken.js";

const orderRouter = express.Router();

orderRouter.post("/create", authToken, createOrder);
orderRouter.get("/my-orders", authToken, getMyOrders);
orderRouter.get("/:id", authToken, getOrderById);

export default orderRouter;
