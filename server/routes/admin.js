const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard data (counts, recent orders, sales statistics)
 * @access  Private/Admin
 */
router.get('/dashboard', protect, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
      
    // Get sales data for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const salesData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get top selling products
    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select('name price sold');
      
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          products: productCount,
          orders: orderCount
        },
        recentOrders,
        salesData,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
}));

module.exports = router;
