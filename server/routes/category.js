const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Middleware
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadCategoryImageMiddleware, 
  processCategoryImage 
} = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadCategoryImageMiddleware,
  processCategoryImage,
  [
    check('name', 'Category name is required').not().isEmpty()
  ],
  createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private/Admin
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadCategoryImageMiddleware,
  processCategoryImage,
  updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteCategory
);

/**
 * @route   POST /api/categories/:id/image
 * @desc    Upload category image
 * @access  Private/Admin
 */
router.post(
  '/:id/image',
  protect,
  authorize('admin'),
  uploadCategoryImageMiddleware,
  processCategoryImage,
  (req, res) => {
    res.status(200).json({ success: true, image: req.body.image });
  }
);

module.exports = router;
