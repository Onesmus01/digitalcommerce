import HotDeal from '../models/HotDealsModel.js';
import Product from '../models/productModel.js';

// ===================== HOT DEAL CONTROLLER =====================
export const hotDealsController = {

  addHotDeal: async (req, res) => {
    try {
      const { productId, discountPercent, dealType, duration } = req.body;

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
          message: 'Product is already in hot deals'
        });
      }

      const endTime = new Date(Date.now() + (duration || 24) * 60 * 60 * 1000);

      const hotDeal = await HotDeal.create({
        productId,
        discountPercent,
        dealType: dealType || 'percentage',
        endTime,
        isActive: true,
        createdBy: req.user?._id
      });

      await hotDeal.populate('productId');

      res.status(201).json({
        success: true,
        message: 'Product added to hot deals successfully',
        data: hotDeal
      });

    } catch (error) {
      console.error('Error adding hot deal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add hot deal',
        error: error.message
      });
    }
  },

  getHotDeals: async (req, res) => {
    try {
      const { status, limit = 50 } = req.query;

      let query = {};

      if (status === 'active') {
        query = {
          isActive: true,
          endTime: { $gt: new Date() }
        };
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
        .limit(parseInt(limit));

      const activeDeals = hotDeals.filter(
        d => d.isActive && new Date(d.endTime) > new Date()
      );

      const expiredDeals = hotDeals.filter(
        d => !d.isActive || new Date(d.endTime) <= new Date()
      );

      res.status(200).json({
        success: true,
        count: hotDeals.length,
        stats: {
          active: activeDeals.length,
          expired: expiredDeals.length
        },
        data: hotDeals
      });

    } catch (error) {
      console.error('Error fetching hot deals:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hot deals',
        error: error.message
      });
    }
  },

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
      console.error('Error fetching hot deal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hot deal',
        error: error.message
      });
    }
  },

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

      if (discountPercent !== undefined) {
        hotDeal.discountPercent = discountPercent;
      }

      if (isActive !== undefined) {
        hotDeal.isActive = isActive;
      }

      if (duration) {
        const currentEnd = new Date(hotDeal.endTime);
        hotDeal.endTime = new Date(
          currentEnd.getTime() + duration * 60 * 60 * 1000
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
      console.error('Error updating hot deal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update hot deal',
        error: error.message
      });
    }
  },

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
        message: 'Hot deal removed successfully'
      });

    } catch (error) {
      console.error('Error deleting hot deal:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove hot deal',
        error: error.message
      });
    }
  }

};


// ===================== PRODUCT SEARCH CONTROLLER =====================
export const productSearchController = {

  searchProducts: async (req, res) => {
    try {
      const { q, limit = 20, category } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters'
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

      const activeHotDeals = await HotDeal.find({
        isActive: true,
        endTime: { $gt: new Date() }
      }).distinct('productId');

      searchQuery.$and.push({
        _id: { $nin: activeHotDeals }
      });

      const products = await Product.find(searchQuery)
        .select('productName price productImage category description brandName')
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });

    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
        error: error.message
      });
    }
  }

};