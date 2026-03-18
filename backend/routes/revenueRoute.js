import express from 'express';
import {
  getDashboardStats,
  getDailyRevenueBreakdown,
  getRevenueByCategory,
  getRevenueByPaymentMethod,
  getRecentTransactions,
  getAIPrediction,
  updateTargets,
  getFullRevenueReport
} from '../controller/revenueController.js';
import authToken from '../middleware/authToken.js';
import isAdmin from '../middleware/adminAuth.js';

const revenueRouter = express.Router();

// All routes require authentication and admin privileges
revenueRouter.use(authToken, isAdmin);

// ===================== MAIN DASHBOARD ROUTES =====================

// Get main dashboard statistics (revenue, orders, deliveries, customers)
revenueRouter.get('/dashboard-stats', getDashboardStats);

// Get daily revenue breakdown for charts
revenueRouter.get('/daily-breakdown', getDailyRevenueBreakdown);

// ===================== ANALYTICS ROUTES =====================

// Get revenue by product category
revenueRouter.get('/by-category', getRevenueByCategory);

// Get revenue by payment method
revenueRouter.get('/by-payment-method', getRevenueByPaymentMethod);

// Get recent transactions
revenueRouter.get('/recent-transactions', getRecentTransactions);

// ===================== AI & PREDICTION ROUTES =====================

// Get AI revenue prediction
revenueRouter.get('/ai-prediction', getAIPrediction);

// ===================== MANAGEMENT ROUTES =====================

// Update revenue targets
revenueRouter.put('/update-targets', updateTargets);

// ===================== REPORTING ROUTES =====================

// Get full comprehensive report (exportable)
revenueRouter.get('/full-report', getFullRevenueReport);

export default revenueRouter;