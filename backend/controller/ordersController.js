import Order from "../models/OrderModel.js";
import { getIO } from "../soket.js"; 
import Product from "../models/productModel.js"

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
    try {
      const io = getIO();
      io.to("admins").emit("new-order", {
      id: order._id,
      customer: order.user?.name || "Unknown",
      product: order.items[0]?.name || "Product",
      amount: order.totalAmount,
      status: order.orderStatus || "processing",
      createdAt: order.createdAt,   // ✅ ADD THIS
      isRead: false,
});
      console.log("🔥 Admins notified of new order:", order._id);
    } catch (socketErr) {
      console.log("⚠️ Socket emit failed:", socketErr.message);
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
    try {
      const io = getIO();
      io.to("admins").emit("order-cancelled", {
        id: order._id,
        customer: order.user?.name || "Unknown",
        product: order.items[0]?.name || "Product",
        status: "cancelled",
      });
    } catch (socketErr) {
      console.log("⚠️ Socket emit failed:", socketErr.message);
    }

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
    try {
      const io = getIO();

      // 🔔 Notify admins
      io.to("admins").emit("order-status-updated", {
        id: order._id,
        customer: order.user?.name || "Unknown",
        product: order.items[0]?.name || "Product",
        status: order.orderStatus,
      });

      // 🔔 Notify the specific user
      io.to(order.user._id.toString()).emit("user-order-status", {
      orderId: order._id,
      status: order.orderStatus,
      product: order.items[0]?.name || "Product",  // ✅ ADD
      message: `Your order for ${order.items[0]?.name || "product"} is now ${order.orderStatus}`,
});

      console.log("🔔 Order status notification sent to user:", order.user._id);

    } catch (socketErr) {
      console.log("⚠️ Socket emit failed:", socketErr.message);
    }

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
  if (req.role !== "ADMIN") {
  return res.status(403).json({ message: "Unauthorized" });
}
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

export const getTotalOrders = async (req, res) => {
  try {
    // Count all orders
    const totalOrders = await Order.countDocuments();

    // Optional: count only completed orders
    const completedOrders = await Order.countDocuments({
      status: "delivered", // change if your status field is different
    });

    return res.status(200).json({
      success: true,
      message: "Total orders fetched successfully",
      data: {
        totalOrders,
        completedOrders,
      },
    });
  } catch (error) {
    console.error("Get total orders error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const addProductUserNotification = async (req,res)=>{
  try{

    const product = await Product.create(req.body)

    const io = getIO()

    // 🔔 Notify all users
    io.emit("new-product-added",{
    title: "New Product",
    message:`🔥 ${product.productName} is now available`,
    productId:product._id,
    image: product.productImage?.[0] || null
  })

    res.status(201).json({
      success:true,
      product
    })

  }catch(err){
    res.status(500).json({message:err.message})
  }
}

// GET user notifications with product images
export const getUserNotifications = async (req, res) => {
  try {
    // Fetch orders of the logged-in user, populate product info
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name image") // ✅ populate product name & image
      .sort({ createdAt: -1 })
      .limit(20); // last 20 notifications

    const unreadCount = orders.filter(o => !o.isRead).length;

    const notifications = orders.map(order => ({
      id: order._id,
      product: order.items[0]?.product?.name || "Product",
      image: order.items[0]?.product?.image?.[0] || null, // ✅ first product image
      status: order.orderStatus,
      createdAt: order.createdAt,
      isRead: order.isRead,
    }));

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// Mark a single notification (order) as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find the order/notification
    const notification = await Order.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    // Only the user who owns it can mark as read
    if (notification.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Order.updateMany({ user: req.userId, isRead: false }, { $set: { isRead: true } });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};