const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { seedDemoProducts } = require('../controllers/demoProductController');

/**
 * @route   POST /api/demo/products
 * @desc    Create demo products from the provided images
 * @access  Private/Admin
 */
router.post('/products', protect, authorize('admin'), seedDemoProducts);

module.exports = router;
