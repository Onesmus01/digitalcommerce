import express from 'express';
import { hotDealsController, productSearchController } from '../controller/hotDealsController.js';
import authToken from '../middleware/authToken.js';

const hotDealRouter = express.Router();

// ✅ IMPORTANT: specific routes FIRST
hotDealRouter.get('/product/search', authToken, productSearchController.searchProducts);
hotDealRouter.get('/product/category/:category', productSearchController.getProductsByCategory);

// Hot deals
hotDealRouter.post('/', authToken, hotDealsController.addHotDeal);
hotDealRouter.get('/', hotDealsController.getHotDeals);
hotDealRouter.get('/:id', hotDealsController.getHotDealById);
hotDealRouter.put('/:id', authToken, hotDealsController.updateHotDeal);
hotDealRouter.delete('/:id', authToken, hotDealsController.deleteHotDeal);
hotDealRouter.put('/:id/reactivate', authToken, hotDealsController.reactivateHotDeal);

export default hotDealRouter;