import express from 'express';
const hotDealRouter = express.Router();
import{ hotDealsController, productSearchController } from'../controller/hotDealsController.js';
import authToken from '../middleware/authToken.js'; // Your auth middleware

// Hot Deals Routes
hotDealRouter.post('/', authToken, hotDealsController.addHotDeal);
hotDealRouter.get('/', hotDealsController.getHotDeals);
hotDealRouter.get('/stats', authToken , hotDealsController.getHotDealStats);
hotDealRouter.get('/:id', hotDealsController.getHotDealById);
hotDealRouter.put('/:id', authToken, hotDealsController.updateHotDeal);
hotDealRouter.delete('/:id', authToken, hotDealsController.deleteHotDeal);
hotDealRouter.put('/:id/reactivate', authToken, hotDealsController.reactivateHotDeal);

// Product Search Routes
hotDealRouter.get('/product/search', authToken, productSearchController.searchProducts);
hotDealRouter.get('/product/category/:category', productSearchController.getProductsByCategory);

export default hotDealRouter;