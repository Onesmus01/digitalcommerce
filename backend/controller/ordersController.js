import Order from "../models/OrderModel.js";
import { io } from "../index.js"; // 🔥 IMPORTANT


// CREATE order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    // ✅ Validate order items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order",
      });
    }

    // ✅ Create order
    const order = await Order.create({
      user: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      isRead: false, // 🔥 used for notifications
    });

    await order.populate("user", "name"); // populate user name

    // 🔔 Emit real-time notification to admins
    if (io) {
      io.to("admins").emit("new-order", {
        id: order._id,
        customer: order.user?.name || "Unknown",
        product: order.items[0]?.name || "Product",
        status: order.orderStatus || "processing",
        isRead: false,
      });
      console.log("🔥 Admins notified of new order:", order._id);
    }

    res.status(201).json({
      success: true,
      order,
    });

    console.log("✅ Order created successfully:", order._id);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name price")
      .populate("shippingAddress");

    res.status(200).json({
      success: true,
      orders,
    });
    console.log("Fetched orders for user:", req.userId, orders);
  } catch (error) {
    console.error("Error fetching orders for user:", req.userId, error);  
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    })
      .populate("items.product")
      .populate("shippingAddress");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "processing") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    // 🔥 REAL-TIME CANCEL EVENT
    io.to("admins").emit("order-cancelled", {
      id: order._id,
      customer: order.user?.name || "Unknown",
      product: order.items[0]?.name || "Product",
      status: "cancelled",
    });

    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")   // 🔥 ADD THIS
      .populate("items.product", "name price")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email profilePic role") // user info
      .populate("items.product", "name price image") // product info
      .populate("shippingAddress") // shipping details
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(orderId).populate("user", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // 🔥 REAL-TIME STATUS UPDATE
    io.to("admins").emit("order-status-updated", {
      id: order._id,
      customer: order.user?.name || "Unknown",
      product: order.items[0]?.name || "Product",
      status: order.orderStatus,
    });

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      message: "Server error while updating order status",
    });
  }
};

export const getOrderNotifications = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const unreadCount = await Order.countDocuments({ isRead: false });

    const notifications = orders.map((order) => ({
      id: order._id,
      customer: order.user?.name || "Unknown",
      product: order.items[0]?.name || "Product",
      status: order.orderStatus,
      isRead: order.isRead,
    }));

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
export const markNotificationsAsRead = async (req, res) => {
  try {
    await Order.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

