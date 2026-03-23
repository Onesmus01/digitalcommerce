import HotDeal from '../models/hotDealsModel.js';
import Product from '../models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

// ===================== HOT DEAL CONTROLLER =====================
export const hotDealsController = {

  // ✅ ADD HOT DEAL
  addHotDeal: async (req, res) => {
    try {
      const { productId, discountPercent, dealType = 'percentage', duration = 24 } = req.body;

      if (!productId || !discountPercent) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and discount percentage are required'
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const existingDeal = await HotDeal.findOne({
        productId,
        isActive: true,
        endTime: { $gt: new Date() }
      });

      if (existingDeal) {
        return res.status(400).json({
          success: false,
          message: 'Product already has an active hot deal'
        });
      }

      const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);

      const hotDeal = await HotDeal.create({
        productId,
        discountPercent,
        dealType,
        endTime,
        isActive: true,
        createdBy: req.user?._id
      });

      await hotDeal.populate('productId');

      res.status(201).json({
        success: true,
        message: 'Hot deal created successfully',
        data: hotDeal
      });

    } catch (error) {
      console.error('ADD HOT DEAL ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add hot deal',
        error: error.message
      });
    }
  },

  // ✅ GET ALL HOT DEALS
  getHotDeals: async (req, res) => {
    try {
      const { status, limit = 50 } = req.query;

      let query = {};

      if (status === 'active') {
        query = { isActive: true, endTime: { $gt: new Date() } };
      } else if (status === 'expired') {
        query = {
          $or: [
            { isActive: false },
            { endTime: { $lte: new Date() } }
          ]
        };
      }

      const hotDeals = await HotDeal.find(query)
        .populate('productId', 'productName price productImage category description')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      const now = new Date();

      const stats = {
        active: hotDeals.filter(d => d.isActive && new Date(d.endTime) > now).length,
        expired: hotDeals.filter(d => !d.isActive || new Date(d.endTime) <= now).length
      };

      res.status(200).json({
        success: true,
        count: hotDeals.length,
        stats,
        data: hotDeals
      });

    } catch (error) {
      console.error('GET HOT DEALS ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hot deals',
        error: error.message
      });
    }
  },

  // ✅ GET SINGLE HOT DEAL
  getHotDealById: async (req, res) => {
    try {
      const hotDeal = await HotDeal.findById(req.params.id)
        .populate('productId', 'productName price productImage category description')
        .populate('createdBy', 'name email');

      if (!hotDeal) {
        return res.status(404).json({
          success: false,
          message: 'Hot deal not found'
        });
      }

      res.status(200).json({
        success: true,
        data: hotDeal
      });

    } catch (error) {
      console.error('GET HOT DEAL ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hot deal',
        error: error.message
      });
    }
  },

  // ✅ UPDATE HOT DEAL
  updateHotDeal: async (req, res) => {
    try {
      const { discountPercent, isActive, duration } = req.body;

      const hotDeal = await HotDeal.findById(req.params.id);
      if (!hotDeal) {
        return res.status(404).json({
          success: false,
          message: 'Hot deal not found'
        });
      }

      if (discountPercent !== undefined) hotDeal.discountPercent = discountPercent;
      if (isActive !== undefined) hotDeal.isActive = isActive;

      if (duration) {
        hotDeal.endTime = new Date(
          new Date(hotDeal.endTime).getTime() + duration * 60 * 60 * 1000
        );
      }

      hotDeal.updatedAt = Date.now();

      await hotDeal.save();
      await hotDeal.populate('productId');

      res.status(200).json({
        success: true,
        message: 'Hot deal updated successfully',
        data: hotDeal
      });

    } catch (error) {
      console.error('UPDATE HOT DEAL ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update hot deal',
        error: error.message
      });
    }
  },

  // ✅ DELETE (SOFT DELETE)
  deleteHotDeal: async (req, res) => {
    try {
      const hotDeal = await HotDeal.findById(req.params.id);

      if (!hotDeal) {
        return res.status(404).json({
          success: false,
          message: 'Hot deal not found'
        });
      }

      hotDeal.isActive = false;
      hotDeal.updatedAt = Date.now();

      await hotDeal.save();

      res.status(200).json({
        success: true,
        message: 'Hot deal deactivated successfully'
      });

    } catch (error) {
      console.error('DELETE HOT DEAL ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete hot deal',
        error: error.message
      });
    }
  },

  // ✅ REACTIVATE HOT DEAL (FIXED 🔥)
  reactivateHotDeal: async (req, res) => {
    try {
      const hotDeal = await HotDeal.findById(req.params.id);

      if (!hotDeal) {
        return res.status(404).json({
          success: false,
          message: 'Hot deal not found'
        });
      }

      hotDeal.isActive = true;
      hotDeal.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      hotDeal.updatedAt = Date.now();

      await hotDeal.save();
      await hotDeal.populate('productId');

      res.status(200).json({
        success: true,
        message: 'Hot deal reactivated successfully',
        data: hotDeal
      });

    } catch (error) {
      console.error('REACTIVATE ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reactivate hot deal',
        error: error.message
      });
    }
  }

};


// ===================== PRODUCT SEARCH CONTROLLER =====================
export const productSearchController = {

  // ✅ SEARCH PRODUCTS
  searchProducts: async (req, res) => {
    try {
      const { q, limit = 20, category } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search must be at least 2 characters'
        });
      }

      const searchQuery = {
        $and: [
          {
            $or: [
              { productName: { $regex: q, $options: 'i' } },
              { description: { $regex: q, $options: 'i' } },
              { category: { $regex: q, $options: 'i' } },
              { brandName: { $regex: q, $options: 'i' } }
            ]
          }
        ]
      };

      if (category) {
        searchQuery.$and.push({ category });
      }

      // exclude active hot deals
      const activeHotDeals = await HotDeal.find({
        isActive: true,
        endTime: { $gt: new Date() }
      }).distinct('productId');

      searchQuery.$and.push({ _id: { $nin: activeHotDeals } });

      const products = await Product.find(searchQuery)
        .select('productName price productImage category description brandName')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });

    } catch (error) {
      console.error('SEARCH ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
        error: error.message
      });
    }
  },

  // ✅ GET PRODUCTS BY CATEGORY (ADDED 🔥)
  getProductsByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      const products = await Product.find({ category })
        .select('productName price productImage category description brandName')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });

    } catch (error) {
      console.error('CATEGORY ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category products',
        error: error.message
      });
    }
  }

};
