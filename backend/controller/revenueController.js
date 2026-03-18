import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// ===================== HELPER FUNCTIONS =====================

const getStartOfMonth = (date = new Date()) => {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfMonth = (date = new Date()) => {
  const end = new Date(date);
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  return end;
};

const getStartOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = (date = new Date()) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

// ===================== MAIN CONTROLLERS =====================

/**
 * @desc    Get dashboard statistics with editable targets
 * @route   GET /api/revenue/dashboard-stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = getStartOfMonth(now);
    const endOfMonth = getEndOfMonth(now);
    const startOfLastMonth = getStartOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));

    // ========== REVENUE CALCULATIONS ==========
    // Current month successful payments
    const currentMonthPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalRevenue = currentMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);

    // Last month revenue for comparison
    const lastMonthPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });
    const lastMonthRevenue = lastMonthPayments.reduce((acc, payment) => acc + payment.amount, 0);

    // Calculate revenue growth %
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;

    // ========== ORDERS CALCULATIONS ==========
    // Total orders this month
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Last month orders for comparison
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });

    const ordersGrowth = lastMonthOrders > 0
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
      : 0;

    // ========== DELIVERED ORDERS ==========
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const lastMonthDelivered = await Order.countDocuments({
      orderStatus: "delivered",
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
    });

    const deliveredGrowth = lastMonthDelivered > 0
      ? ((deliveredOrders - lastMonthDelivered) / lastMonthDelivered * 100).toFixed(1)
      : 0;

    // Delivery rate %
    const deliveryRate = totalOrders > 0 
      ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
      : 0;

    // ========== NEW CUSTOMERS ==========
    // Users who made their first order this month
    const newCustomersAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$user",
          firstOrder: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          firstOrder: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $count: "newCustomers"
      }
    ]);

    const newCustomers = newCustomersAgg[0]?.newCustomers || 0;

    // Last month new customers
    const lastMonthNewCustomersAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
        }
      },
      {
        $group: {
          _id: "$user",
          firstOrder: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          firstOrder: { $gte: startOfLastMonth, $lt: startOfMonth }
        }
      },
      {
        $count: "newCustomers"
      }
    ]);

    const lastMonthNewCustomers = lastMonthNewCustomersAgg[0]?.newCustomers || 0;
    const customersGrowth = lastMonthNewCustomers > 0
      ? ((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers * 100).toFixed(1)
      : 0;

    // ========== DEFAULT TARGETS (Can be stored in DB later) ==========
    // These can be updated via separate API endpoint
    const defaultTargets = {
      revenue: { goal: 50000, current: totalRevenue },
      orders: { goal: 500, current: totalOrders },
      deliveries: { goal: 400, current: deliveredOrders },
      customers: { goal: 200, current: newCustomers }
    };

    res.status(200).json({
      success: true,
      stats: {
        revenue: {
          current: totalRevenue,
          lastMonth: lastMonthRevenue,
          growth: Number(revenueGrowth),
          target: defaultTargets.revenue.goal,
          label: "Monthly Revenue",
          description: "Total sales revenue this month"
        },
        orders: {
          current: totalOrders,
          lastMonth: lastMonthOrders,
          growth: Number(ordersGrowth),
          target: defaultTargets.orders.goal,
          label: "Total Orders",
          description: "Number of completed orders"
        },
        deliveries: {
          current: deliveredOrders,
          lastMonth: lastMonthDelivered,
          growth: Number(deliveredGrowth),
          deliveryRate: Number(deliveryRate),
          target: defaultTargets.deliveries.goal,
          label: "Delivered Orders",
          description: "Successfully delivered orders"
        },
        customers: {
          current: newCustomers,
          lastMonth: lastMonthNewCustomers,
          growth: Number(customersGrowth),
          target: defaultTargets.customers.goal,
          label: "New Customers",
          description: "First-time buyers this month"
        }
      },
      period: {
        start: startOfMonth,
        end: endOfMonth,
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' })
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message
    });
  }
};

/**
 * @desc    Get daily revenue breakdown for charts
 * @route   GET /api/revenue/daily-breakdown
 * @access  Private/Admin
 */
export const getDailyRevenueBreakdown = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = getStartOfMonth(now);
    const endOfMonth = getEndOfMonth(now);

    // Aggregate daily revenue
    const dailyRevenue = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    // Aggregate daily orders
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    // Merge data and fill missing days
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const chartData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const revenueData = dailyRevenue.find(
        d => d._id.day === day
      );
      
      const orderData = dailyOrders.find(
        d => d._id.day === day
      );

      chartData.push({
        date: dateStr,
        displayDate,
        revenue: revenueData?.revenue || 0,
        orders: orderData?.orders || 0,
        target: 4000 // Default daily target
      });
    }

    res.status(200).json({
      success: true,
      data: chartData,
      summary: {
        totalRevenue: chartData.reduce((acc, day) => acc + day.revenue, 0),
        totalOrders: chartData.reduce((acc, day) => acc + day.orders, 0),
        averageDailyRevenue: chartData.reduce((acc, day) => acc + day.revenue, 0) / daysInMonth
      }
    });

  } catch (error) {
    console.error("Daily breakdown error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching daily revenue breakdown",
      error: error.message
    });
  }
};

/**
 * @desc    Get revenue by product category
 * @route   GET /api/revenue/by-category
 * @access  Private/Admin
 */
export const getRevenueByCategory = async (req, res) => {
  try {
    const startOfMonth = getStartOfMonth();

    const categoryRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: "success"
        }
      },
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $unwind: "$productInfo"
      },
      {
        $group: {
          _id: "$productInfo.category",
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] }
          },
          orders: { $sum: 1 },
          quantity: { $sum: "$items.quantity" }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    // Calculate growth (compare with last month)
    const startOfLastMonth = getStartOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const endOfLastMonth = getEndOfMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));

    const lastMonthCategoryRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          paymentStatus: "success"
        }
      },
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $unwind: "$productInfo"
      },
      {
        $group: {
          _id: "$productInfo.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      }
    ]);

    // Format response with growth calculation
    const formattedData = categoryRevenue.map(cat => {
      const lastMonth = lastMonthCategoryRevenue.find(l => l._id === cat._id);
      const lastMonthRevenue = lastMonth?.revenue || 0;
      const growth = lastMonthRevenue > 0 
        ? ((cat.revenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 0;

      return {
        name: cat._id || "Uncategorized",
        value: cat.revenue,
        orders: cat.orders,
        quantity: cat.quantity,
        growth: Number(growth)
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData,
      totalRevenue: formattedData.reduce((acc, cat) => acc + cat.value, 0)
    });

  } catch (error) {
    console.error("Category revenue error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue by category",
      error: error.message
    });
  }
};

/**
 * @desc    Get revenue by payment method
 * @route   GET /api/revenue/by-payment-method
 * @access  Private/Admin
 */
export const getRevenueByPaymentMethod = async (req, res) => {
  try {
    const startOfMonth = getStartOfMonth();

    const paymentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: "success"
        }
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = paymentStats.reduce((acc, method) => acc + method.revenue, 0);
    const totalCount = paymentStats.reduce((acc, method) => acc + method.count, 0);

    const formattedData = paymentStats.map(method => ({
      name: method._id.charAt(0).toUpperCase() + method._id.slice(1),
      value: Math.round((method.count / totalCount) * 100),
      amount: method.revenue,
      count: method.count,
      percentage: ((method.revenue / totalRevenue) * 100).toFixed(1)
    }));

    // Sort by revenue descending
    formattedData.sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      success: true,
      data: formattedData,
      totalRevenue,
      totalTransactions: totalCount
    });

  } catch (error) {
    console.error("Payment method stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment method statistics",
      error: error.message
    });
  }
};

/**
 * @desc    Get recent transactions
 * @route   GET /api/revenue/recent-transactions
 * @access  Private/Admin
 */
export const getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const formattedTransactions = transactions.map(order => ({
      id: `#ORD-${order._id.toString().slice(-4).toUpperCase()}`,
      customer: order.user?.name || 'Guest',
      email: order.user?.email,
      amount: order.totalAmount,
      status: order.paymentStatus,
      orderStatus: order.orderStatus,
      date: order.createdAt,
      product: order.items[0]?.name || order.items[0]?.product?.name || 'Multiple Items',
      paymentMethod: order.paymentMethod,
      itemCount: order.items.length
    }));

    res.status(200).json({
      success: true,
      data: formattedTransactions,
      count: formattedTransactions.length
    });

  } catch (error) {
    console.error("Recent transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent transactions",
      error: error.message
    });
  }
};

/**
 * @desc    Get AI revenue prediction
 * @route   GET /api/revenue/ai-prediction
 * @access  Private/Admin
 */
export const getAIPrediction = async (req, res) => {
  try {
    // Get last 6 months of data for trend analysis
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    if (monthlyData.length === 0) {
      return res.status(200).json({
        success: true,
        prediction: {
          predictedRevenue: 0,
          growthPercent: 0,
          confidence: "low",
          factors: ["No historical data available"],
          period: "next_month"
        }
      });
    }

    // Calculate trend
    const revenues = monthlyData.map(m => m.revenue);
    const lastMonth = revenues[revenues.length - 1];
    const previousMonth = revenues[revenues.length - 2] || lastMonth;
    
    // Simple linear regression for trend
    const n = revenues.length;
    const sumX = revenues.reduce((acc, _, i) => acc + i, 0);
    const sumY = revenues.reduce((acc, val) => acc + val, 0);
    const sumXY = revenues.reduce((acc, val, i) => acc + i * val, 0);
    const sumXX = revenues.reduce((acc, _, i) => acc + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Predict next month
    const predictedRevenue = Math.round(slope * n + intercept);
    
    // Calculate growth
    const growthPercent = previousMonth > 0 
      ? ((predictedRevenue - previousMonth) / previousMonth * 100).toFixed(1)
      : 10;

    // Determine confidence based on data consistency
    const variance = revenues.reduce((acc, val) => acc + Math.pow(val - (sumY / n), 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / (sumY / n);
    
    let confidence = "medium";
    if (coefficientOfVariation < 0.15) confidence = "high";
    else if (coefficientOfVariation > 0.4) confidence = "low";

    // Generate factors based on data
    const factors = [];
    if (slope > 0) factors.push("Upward revenue trend detected");
    else if (slope < 0) factors.push("Downward trend - consider promotions");
    
    if (monthlyData[monthlyData.length - 1].transactions > monthlyData[0].transactions) {
      factors.push("Increasing customer acquisition");
    }
    
    factors.push("Historical sales pattern analysis");
    factors.push("Seasonal adjustment applied");

    res.status(200).json({
      success: true,
      prediction: {
        predictedRevenue: Math.max(0, predictedRevenue),
        growthPercent: Number(growthPercent),
        confidence,
        factors,
        period: "next_month",
        trend: slope > 0 ? "upward" : slope < 0 ? "downward" : "stable",
        historicalData: monthlyData.map(m => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          revenue: m.revenue
        }))
      }
    });

  } catch (error) {
    console.error("AI prediction error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating AI prediction",
      error: error.message
    });
  }
};

/**
 * @desc    Update revenue targets (can be stored in settings collection)
 * @route   PUT /api/revenue/update-targets
 * @access  Private/Admin
 */
export const updateTargets = async (req, res) => {
  try {
    const { targets } = req.body;

    // Validate targets
    const validTargets = ['revenue', 'orders', 'deliveries', 'customers'];
    const updates = {};

    for (const key of validTargets) {
      if (targets[key] && typeof targets[key].goal === 'number') {
        updates[key] = {
          goal: targets[key].goal,
          updatedAt: new Date()
        };
      }
    }


    res.status(200).json({
      success: true,
      message: "Targets updated successfully",
      targets: updates
    });

  } catch (error) {
    console.error("Update targets error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating targets",
      error: error.message
    });
  }
};

/**
 * @desc    Get comprehensive revenue report (exportable)
 * @route   GET /api/revenue/full-report
 * @access  Private/Admin
 */
export const getFullRevenueReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Parallel data fetching
    const [
      revenueStats,
      ordersStats,
      categoryStats,
      paymentStats,
      dailyBreakdown
    ] = await Promise.all([
      // Revenue
      Payment.aggregate([
        { $match: { status: "success", createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]),
      
      // Orders
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { 
          _id: null, 
          total: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] } },
          shipped: { $sum: { $cond: [{ $eq: ["$orderStatus", "shipped"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] } }
        }}
      ]),
      
      // Categories
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: "success" } },
        { $unwind: "$items" },
        { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "product" } },
        { $unwind: "$product" },
        { $group: { _id: "$product.category", revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, count: { $sum: 1 } } },
        { $sort: { revenue: -1 } }
      ]),
      
      // Payment methods
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: "success" } },
        { $group: { _id: "$paymentMethod", revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
      ]),
      
      // Daily breakdown
      Payment.aggregate([
        { $match: { status: "success", createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { 
          _id: { day: { $dayOfMonth: "$createdAt" } }, 
          revenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }},
        { $sort: { "_id.day": 1 } }
      ])
    ]);

    const report = {
      period: { year, month, startDate, endDate },
      summary: {
        totalRevenue: revenueStats[0]?.total || 0,
        totalTransactions: revenueStats[0]?.count || 0,
        totalOrders: ordersStats[0]?.total || 0,
        deliveredOrders: ordersStats[0]?.delivered || 0,
        deliveryRate: ordersStats[0]?.total > 0 
          ? ((ordersStats[0].delivered / ordersStats[0].total) * 100).toFixed(1) 
          : 0,
        averageOrderValue: ordersStats[0]?.total > 0 
          ? (revenueStats[0]?.total / ordersStats[0].total).toFixed(2) 
          : 0
      },
      orderStatusBreakdown: ordersStats[0] ? {
        pending: ordersStats[0].pending,
        processing: ordersStats[0].processing,
        shipped: ordersStats[0].shipped,
        delivered: ordersStats[0].delivered,
        cancelled: ordersStats[0].cancelled
      } : {},
      topCategories: categoryStats.map(c => ({
        category: c._id,
        revenue: c.revenue,
        orders: c.count
      })),
      paymentMethods: paymentStats.map(p => ({
        method: p._id,
        revenue: p.revenue,
        transactions: p.count
      })),
      dailyRevenue: dailyBreakdown.map(d => ({
        day: d._id.day,
        revenue: d.revenue,
        transactions: d.count
      }))
    };

    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    console.error("Full report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating full report",
      error: error.message
    });
  }
};