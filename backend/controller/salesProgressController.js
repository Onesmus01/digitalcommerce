import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";

export const getDashboardProgress = async (req, res) => {
  try {

    // SUCCESSFUL PAYMENTS
    const payments = await Payment.find({ status: "success" });

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // DELIVERED ORDERS
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    // Example Goals (you can change)
    const revenueGoal = 5000;
    const ordersGoal = 500;
    const deliveryGoal = 300;

    res.status(200).json({
      success: true,
      progress: {
        revenue: {
          current: totalRevenue,
          goal: revenueGoal,
          label: "Revenue Target",
        },
        orders: {
          current: totalOrders,
          goal: ordersGoal,
          label: "Orders Target",
        },
        deliveries: {
          current: deliveredOrders,
          goal: deliveryGoal,
          label: "Delivered Orders",
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loading dashboard progress",
      error: error.message,
    });
  }
};


export const getMonthlyRevenue = async (req, res) => {
  try {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get successful payments this month
    const payments = await Payment.find({
      status: "success",
      createdAt: { $gte: startOfMonth }
    });

    const revenue = payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);

    res.status(200).json({
      success: true,
      revenue
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error getting monthly revenue",
      error: error.message
    });

  }
};


// Simple AI Prediction based on historical revenue
export const getAIPrediction = async (req, res) => {
  try {
    // Get all successful payments
    const payments = await Payment.find({ status: "success" }).sort({ createdAt: 1 });

    if (!payments.length) {
      return res.status(200).json({
        prediction: {
          predictedRevenue: 0,
          growthPercent: 0,
          confidence: "low",
          factors: ["No historical data"],
          period: "next_month",
        }
      });
    }

    // Calculate total revenue per month
    const monthlyRevenue = {};

    payments.forEach(p => {
      const month = p.createdAt.getMonth(); // 0-11
      const year = p.createdAt.getFullYear();
      const key = `${year}-${month}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.amount;
    });

    // Get last month revenue
    const months = Object.keys(monthlyRevenue).sort();
    const lastMonthRevenue = monthlyRevenue[months[months.length - 1]] || 0;
    const previousMonthRevenue = monthlyRevenue[months[months.length - 2]] || lastMonthRevenue;

    // Simple prediction: assume growth rate from last month
    const growthPercent = previousMonthRevenue
      ? Math.round(((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
      : 10;

    const predictedRevenue = Math.round(lastMonthRevenue * (1 + growthPercent / 100));

    res.status(200).json({
      prediction: {
        predictedRevenue,
        growthPercent,
        confidence: "medium",
        factors: ["Historical sales trend", "Seasonal patterns"],
        period: "next_month",
      }
    });

  } catch (error) {
    console.error("AI Prediction error:", error);
    res.status(500).json({
      prediction: {
        predictedRevenue: 0,
        growthPercent: 0,
        confidence: "low",
        factors: ["Error calculating prediction"],
        period: "next_month",
      },
      error: error.message,
    });
  }
};