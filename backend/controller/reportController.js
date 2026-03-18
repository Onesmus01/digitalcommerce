import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// ===================== HELPER FUNCTIONS =====================

const getDateRange = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = endDate ? new Date(endDate) : new Date();
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

const getPreviousPeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end - start;
  
  const prevEnd = new Date(start);
  prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
  
  const prevStart = new Date(prevEnd);
  prevStart.setTime(prevEnd.getTime() - duration);
  
  return { start: prevStart, end: prevEnd };
};

const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return Number(((current - previous) / previous * 100).toFixed(1));
};

// ===================== SALES REPORT =====================

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);
    const prevPeriod = getPreviousPeriod(start, end);

    // Current period data
    const currentPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: start, $lte: end }
    });

    const totalRevenue = currentPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalSales = currentPayments.length;

    // Previous period for comparison
    const prevPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }
    });
    const prevRevenue = prevPayments.reduce((acc, p) => acc + p.amount, 0);
    const prevSales = prevPayments.length;

    // Average Order Value
    const currentOrders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    });
    const aov = currentOrders.length > 0 ? totalRevenue / currentOrders.length : 0;

    const prevOrders = await Order.find({
      createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }
    });
    const prevAov = prevOrders.length > 0 ? prevRevenue / prevOrders.length : 0;

    // Conversion rate (mock calculation - would need visitor data)
    const conversionRate = 3.2; // Placeholder
    const prevConversionRate = 2.8;

    // Daily breakdown for charts
    const dailyBreakdown = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: start, $lte: end }
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
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Format daily data
    const formattedDaily = dailyBreakdown.map(day => ({
      date: `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`,
      displayDate: `${day._id.month}/${day._id.day}`,
      revenue: day.revenue,
      orders: day.orders
    }));

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "success"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          sku: { $first: "$items.product" }, // You might want to lookup actual SKU
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Add growth calculation for products (compare with previous period)
    const topProductsWithGrowth = await Promise.all(
      topProducts.map(async (product) => {
        const prevSales = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end },
              paymentStatus: "success"
            }
          },
          { $unwind: "$items" },
          { $match: { "items.product": product._id } },
          {
            $group: {
              _id: null,
              quantity: { $sum: "$items.quantity" }
            }
          }
        ]);

        const prevQty = prevSales[0]?.quantity || 0;
        const growth = calculateGrowth(product.quantity, prevQty);

        return {
          product: product.name,
          sku: product.sku.toString().slice(-8).toUpperCase(),
          quantity: product.quantity,
          revenue: product.revenue,
          growth
        };
      })
    );

    res.status(200).json({
      success: true,
      report: {
        summary: {
          totalRevenue,
          totalSales,
          aov: Math.round(aov),
          conversionRate,
          growth: {
            revenue: calculateGrowth(totalRevenue, prevRevenue),
            sales: calculateGrowth(totalSales, prevSales),
            aov: calculateGrowth(aov, prevAov),
            conversion: calculateGrowth(conversionRate, prevConversionRate)
          }
        },
        dailyBreakdown: formattedDaily,
        topProducts: topProductsWithGrowth
      }
    });

  } catch (error) {
    console.error("Sales report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating sales report",
      error: error.message
    });
  }
};

// ===================== ORDERS REPORT =====================

export const getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);
    const prevPeriod = getPreviousPeriod(start, end);

    // Status breakdown
    const statusCounts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusBreakdown = [
      { name: 'Pending', value: 0, color: '#f59e0b' },
      { name: 'Processing', value: 0, color: '#3b82f6' },
      { name: 'Shipped', value: 0, color: '#a855f7' },
      { name: 'Delivered', value: 0, color: '#10b981' },
      { name: 'Cancelled', value: 0, color: '#ef4444' }
    ];

    statusCounts.forEach(status => {
      const item = statusBreakdown.find(s => s.name.toLowerCase() === status._id);
      if (item) item.value = status.count;
    });

    // Summary stats
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    const prevTotalOrders = await Order.countDocuments({
      createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }
    });

    const delivered = statusBreakdown.find(s => s.name === 'Delivered')?.value || 0;
    const pending = statusBreakdown.find(s => s.name === 'Pending')?.value || 0;
    const cancelled = statusBreakdown.find(s => s.name === 'Cancelled')?.value || 0;

    // Previous period stats for growth
    const prevDelivered = await Order.countDocuments({
      orderStatus: "delivered",
      createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }
    });

    // Hourly distribution
    const hourlyDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedHourly = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      orders: hourlyDistribution.find(h => h._id === i)?.orders || 0
    }));

    // Recent orders with details
    const recentOrders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    const formattedRecent = recentOrders.map(order => ({
      orderId: `#ORD-${order._id.toString().slice(-4).toUpperCase()}`,
      customer: order.user?.name || 'Guest',
      date: order.createdAt,
      total: order.totalAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus
    }));

    res.status(200).json({
      success: true,
      report: {
        summary: {
          totalOrders,
          delivered,
          pending,
          cancelled,
          processing: statusBreakdown.find(s => s.name === 'Processing')?.value || 0,
          growth: {
            total: calculateGrowth(totalOrders, prevTotalOrders),
            delivered: calculateGrowth(delivered, prevDelivered)
          }
        },
        statusBreakdown,
        hourlyDistribution: formattedHourly,
        recentOrders: formattedRecent
      }
    });

  } catch (error) {
    console.error("Orders report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating orders report",
      error: error.message
    });
  }
};

// ===================== CUSTOMERS REPORT =====================

export const getCustomersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);
    const prevPeriod = getPreviousPeriod(start, end);

    // Total customers (unique users who made orders)
    const totalCustomersAgg = await Order.aggregate([
      { $group: { _id: "$user" } },
      { $count: "total" }
    ]);
    const totalCustomers = totalCustomersAgg[0]?.total || 0;

    // New customers (first order in this period)
    const newCustomersAgg = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          firstOrder: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          firstOrder: { $gte: start, $lte: end }
        }
      },
      { $count: "newCustomers" }
    ]);
    const newCustomers = newCustomersAgg[0]?.newCustomers || 0;

    // Previous period new customers
    const prevNewCustomersAgg = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          firstOrder: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          firstOrder: { $gte: prevPeriod.start, $lte: prevPeriod.end }
        }
      },
      { $count: "newCustomers" }
    ]);
    const prevNewCustomers = prevNewCustomersAgg[0]?.newCustomers || 0;

    // Returning customers (have orders before this period)
    const returningCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $lt: ["$createdAt", start] }
                  ]
                }
              }
            }
          ],
          as: "previousOrders"
        }
      },
      {
        $match: {
          "previousOrders.0": { $exists: true }
        }
      },
      {
        $group: {
          _id: "$user"
        }
      },
      { $count: "returning" }
    ]);
    const returningCount = returningCustomers[0]?.returning || 0;

    const returningRate = totalCustomers > 0 ? (returningCount / totalCustomers * 100).toFixed(1) : 0;

    // Customer growth over time (daily)
    const customerGrowth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          newCustomers: {
            $addToSet: "$user"
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Calculate cumulative
    let cumulative = 0;
    const formattedGrowth = customerGrowth.map(day => {
      cumulative += day.newCustomers.length;
      return {
        date: `${day._id.month}/${day._id.day}`,
        customers: cumulative
      };
    });

    // Customer segments (based on order value)
    const customerSegments = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $bucket: {
          groupBy: "$totalSpent",
          boundaries: [0, 100, 500, 1000, 5000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
            avgSpent: { $avg: "$totalSpent" }
          }
        }
      }
    ]);

    const segments = [
      { subject: 'New', A: 0, fullMark: 100 },
      { subject: 'Regular', A: 0, fullMark: 100 },
      { subject: 'Loyal', A: 0, fullMark: 100 },
      { subject: 'VIP', A: 0, fullMark: 100 },
      { subject: 'At Risk', A: 0, fullMark: 100 }
    ];

    // Average Lifetime Value
    const ltvData = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      {
        $group: {
          _id: null,
          avgLtv: { $avg: "$totalSpent" }
        }
      }
    ]);
    const avgLtv = Math.round(ltvData[0]?.avgLtv || 0);

    res.status(200).json({
      success: true,
      report: {
        summary: {
          totalCustomers,
          newCustomers,
          returningRate,
          ltv: avgLtv,
          growth: {
            new: calculateGrowth(newCustomers, prevNewCustomers),
            total: calculateGrowth(totalCustomers, totalCustomers - newCustomers)
          }
        },
        customerGrowth: formattedGrowth,
        segments,
        customerSegments: customerSegments.map(seg => ({
          range: seg._id === 0 ? '$0-$100' : 
                 seg._id === 100 ? '$100-$500' :
                 seg._id === 500 ? '$500-$1K' :
                 seg._id === 1000 ? '$1K-$5K' : '$5K+',
          count: seg.count,
          avgSpent: Math.round(seg.avgSpent)
        }))
      }
    });

  } catch (error) {
    console.error("Customers report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating customers report",
      error: error.message
    });
  }
};

// ===================== PRODUCTS REPORT =====================

export const getProductsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    // Total products
    const totalProducts = await Product.countDocuments({ status: 'active' });
    
    // Low stock (less than 10)
    const lowStock = await Product.countDocuments({
      stock: { $lt: 10, $gt: 0 }
    });
    
    // Out of stock
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    // Total categories
    const categories = await Product.distinct('category');

    // Product performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "success"
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          category: { $first: "$items.category" }, // You may need to lookup
          sold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 }
    ]);

    // Lookup category and stock for each product
    const productsWithDetails = await Promise.all(
      productPerformance.map(async (prod) => {
        const productDetails = await Product.findById(prod._id).select('stock category rating');
        return {
          name: prod.name,
          category: productDetails?.category || 'Uncategorized',
          stock: productDetails?.stock || 0,
          sold: prod.sold,
          revenue: prod.revenue,
          rating: productDetails?.rating || 4.5
        };
      })
    );

    // Category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "success"
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          sold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      report: {
        summary: {
          totalProducts,
          lowStock,
          outOfStock,
          categories: categories.length
        },
        products: productsWithDetails,
        categoryPerformance,
        stockAlerts: productsWithDetails.filter(p => p.stock < 10)
      }
    });

  } catch (error) {
    console.error("Products report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating products report",
      error: error.message
    });
  }
};

// ===================== INVENTORY REPORT =====================

export const getInventoryReport = async (req, res) => {
  try {
    // Stock value calculation
    const stockValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
          totalItems: { $sum: "$stock" }
        }
      }
    ]);

    // Stock movement (received vs sold) - simplified
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const soldItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$items.quantity" }
        }
      }
    ]);

    // Inventory by category
    const inventoryByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
          avgStock: { $avg: "$stock" },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalStock: -1 } }
    ]);

    // Low stock alerts detailed
    const lowStockProducts = await Product.find({
      stock: { $lt: 10 }
    })
    .select('name stock category price')
    .sort({ stock: 1 })
    .limit(20);

    res.status(200).json({
      success: true,
      report: {
        summary: {
          totalValue: stockValue[0]?.totalValue || 0,
          totalItems: stockValue[0]?.totalItems || 0,
          soldThisMonth: soldItems[0]?.totalSold || 0,
          lowStockCount: lowStockProducts.length
        },
        inventoryByCategory,
        lowStockAlerts: lowStockProducts.map(p => ({
          name: p.name,
          category: p.category,
          currentStock: p.stock,
          price: p.price,
          status: p.stock === 0 ? 'Out of Stock' : p.stock < 5 ? 'Critical' : 'Low'
        }))
      }
    });

  } catch (error) {
    console.error("Inventory report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating inventory report",
      error: error.message
    });
  }
};

// ===================== FINANCIAL REPORT =====================

export const getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);
    const prevPeriod = getPreviousPeriod(start, end);

    // Revenue calculations
    const currentPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: start, $lte: end }
    });
    const grossRevenue = currentPayments.reduce((acc, p) => acc + p.amount, 0);

    const prevPayments = await Payment.find({
      status: "success",
      createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }
    });
    const prevGrossRevenue = prevPayments.reduce((acc, p) => acc + p.amount, 0);

    // Refunds (assuming you track refunds separately or in orders)
    const refunds = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          orderStatus: "cancelled",
          paymentStatus: "success"
        }
      },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: "$totalAmount" }
        }
      }
    ]);
    const totalRefunds = refunds[0]?.totalRefunds || 0;

    const netRevenue = grossRevenue - totalRefunds;
    const prevNetRevenue = prevGrossRevenue * 0.95; // Estimate
    const profitMargin = grossRevenue > 0 ? ((netRevenue / grossRevenue) * 100).toFixed(1) : 0;

    // Payment method breakdown
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
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

    // Cost analysis (mock data - you'd calculate real costs)
    const costOfGoods = grossRevenue * 0.6; // 60% COGS estimate
    const operatingCosts = grossRevenue * 0.2; // 20% operating
    const netProfit = netRevenue - costOfGoods - operatingCosts;

    // Monthly trend for year view
    const monthlyTrend = await Payment.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      report: {
        summary: {
          grossRevenue,
          netRevenue,
          refunds: totalRefunds,
          profitMargin: Number(profitMargin),
          netProfit: Math.round(netProfit),
          growth: {
            revenue: calculateGrowth(grossRevenue, prevGrossRevenue),
            net: calculateGrowth(netRevenue, prevNetRevenue)
          }
        },
        paymentMethods: paymentMethods.map(pm => ({
          method: pm._id,
          count: pm.count,
          revenue: pm.revenue,
          percentage: ((pm.revenue / grossRevenue) * 100).toFixed(1)
        })),
        costBreakdown: {
          cogs: costOfGoods,
          operating: operatingCosts,
          marketing: grossRevenue * 0.1,
          netProfit
        },
        monthlyTrend: monthlyTrend.map(m => ({
          month: new Date(2024, m._id.month - 1).toLocaleString('default', { month: 'short' }),
          revenue: m.revenue
        }))
      }
    });

  } catch (error) {
    console.error("Financial report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating financial report",
      error: error.message
    });
  }
};

// ===================== MASTER REPORT (Full Report) =====================

export const getFullReport = async (req, res) => {
  try {
    const { startDate, endDate, type = 'all' } = req.query;
    
    let reportData = {};

    switch (type) {
      case 'sales':
        reportData = (await getSalesReport({ ...req, query: { startDate, endDate } }, { json: () => {} })).report;
        break;
      case 'orders':
        reportData = (await getOrdersReport({ ...req, query: { startDate, endDate } }, { json: () => {} })).report;
        break;
      case 'customers':
        reportData = (await getCustomersReport({ ...req, query: { startDate, endDate } }, { json: () => {} })).report;
        break;
      case 'products':
        reportData = (await getProductsReport({ ...req, query: { startDate, endDate } }, { json: () => {} })).report;
        break;
      case 'financial':
        reportData = (await getFinancialReport({ ...req, query: { startDate, endDate } }, { json: () => {} })).report;
        break;
      default:
        // Get all reports
        const [sales, orders, customers, products, financial] = await Promise.all([
          getSalesReportData(startDate, endDate),
          getOrdersReportData(startDate, endDate),
          getCustomersReportData(startDate, endDate),
          getProductsReportData(startDate, endDate),
          getFinancialReportData(startDate, endDate)
        ]);
        reportData = { sales, orders, customers, products, financial };
    }

    res.status(200).json({
      success: true,
      report: reportData,
      generatedAt: new Date(),
      period: { startDate, endDate }
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

// Helper functions to get data without sending response
const getSalesReportData = async (startDate, endDate) => {
  // Same logic as getSalesReport but returns data
  const { start, end } = getDateRange(startDate, endDate);
  const payments = await Payment.find({
    status: "success",
    createdAt: { $gte: start, $lte: end }
  });
  return {
    totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
    totalSales: payments.length
  };
};

const getOrdersReportData = async (startDate, endDate) => {
  const { start, end } = getDateRange(startDate, endDate);
  const total = await Order.countDocuments({ createdAt: { $gte: start, $lte: end } });
  const delivered = await Order.countDocuments({
    orderStatus: "delivered",
    createdAt: { $gte: start, $lte: end }
  });
  return { total, delivered };
};

const getCustomersReportData = async (startDate, endDate) => {
  const { start, end } = getDateRange(startDate, endDate);
  const newCustomers = await Order.aggregate([
    { $group: { _id: "$user", firstOrder: { $min: "$createdAt" } } },
    { $match: { firstOrder: { $gte: start, $lte: end } } },
    { $count: "count" }
  ]);
  return { newCustomers: newCustomers[0]?.count || 0 };
};

const getProductsReportData = async (startDate, endDate) => {
  const total = await Product.countDocuments();
  const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });
  return { total, lowStock };
};

const getFinancialReportData = async (startDate, endDate) => {
  const { start, end } = getDateRange(startDate, endDate);
  const payments = await Payment.find({
    status: "success",
    createdAt: { $gte: start, $lte: end }
  });
  return {
    grossRevenue: payments.reduce((acc, p) => acc + p.amount, 0)
  };
};