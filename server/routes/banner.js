const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBanners
} = require('../controllers/bannerController');

// Middleware
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadBannerImageMiddleware, 
  processBannerImage 
} = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/banners
 * @desc    Get all banners
 * @access  Public
 */
router.get('/', getBanners);

/**
 * @route   GET /api/banners/active
 * @desc    Get active banners
 * @access  Public
 */
router.get('/active', getActiveBanners);

/**
 * @route   GET /api/banners/:id
 * @desc    Get banner by ID
 * @access  Public
 */
router.get('/:id', getBannerById);

/**
 * @route   POST /api/banners
 * @desc    Create a new banner
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadBannerImageMiddleware,
  processBannerImage,
  [
    // Title validation removed - title is now optional
    // Image check removed as it's handled by middleware
  ],
  createBanner
);

/**
 * @route   PUT /api/banners/:id
 * @desc    Update a banner
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadBannerImageMiddleware,
  processBannerImage,
  updateBanner
);

/**
 * @route   DELETE /api/banners/:id
 * @desc    Delete a banner
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteBanner
);

/**
 * @route   POST /api/banners/:id/image
 * @desc    Upload banner image
 * @access  Private/Admin
 */
router.post(
  '/:id/image',
  protect,
  authorize('admin'),
  uploadBannerImageMiddleware,
  processBannerImage,
  (req, res) => {
    res.status(200).json({ success: true, image: req.body.image });
  }
);

module.exports = router;
