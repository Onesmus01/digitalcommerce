import express from 'express';
import {
  getSalesReport,
  getOrdersReport,
  getCustomersReport,
  getProductsReport,
  getInventoryReport,
  getFinancialReport,
  getFullReport
} from '../controller/reportController.js';
import isAdmin from '../middleware/adminAuth.js';
import authToken from '../middleware/authToken.js';

const reportsRouter = express.Router();

reportsRouter.use(authToken, isAdmin);

reportsRouter.get('/sales', getSalesReport);
reportsRouter.get('/orders', getOrdersReport);
reportsRouter.get('/customers', getCustomersReport);
reportsRouter.get('/products', getProductsReport);
reportsRouter.get('/inventory', getInventoryReport);
reportsRouter.get('/financial', getFinancialReport);
reportsRouter.get('/full-report', getFullReport);

export default reportsRouter;