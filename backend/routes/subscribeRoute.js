import express from "express";
import { 
  subscribeUser, 
  getAllSubscribers, 
  broadcastPromotion, 
  notifyNewProduct, 
  unsubscribeUser, 
  getSubscriberStats, 
  getActivePromotion
} from "../controller/subscribeController.js";
import  authToken  from "../middleware/authToken.js";

const subscribeRouter = express.Router();

// Public routes
subscribeRouter.post("/subscribe-user", subscribeUser);
subscribeRouter.post("/unsubscribe", unsubscribeUser);

// Admin routes (add auth middleware as needed)
subscribeRouter.get("/subscribers",authToken, getAllSubscribers);
subscribeRouter.get("/stats",authToken, getSubscriberStats);
subscribeRouter.post("/broadcast",authToken, broadcastPromotion);
subscribeRouter.post("/notify-product",authToken, notifyNewProduct);
subscribeRouter.get("/active-promotion",authToken,getActivePromotion)

// Add to your route file temporarily
subscribeRouter.get("/test", async (req, res) => {
  try {
    const count = await (await import("../models/subscriberModel.js")).default.countDocuments();
    res.json({ success: true, subscriberCount: count, message: "DB connected!" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default subscribeRouter;