const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const { 
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
} = require('../controllers/productController');

// Middleware
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadProductImagesMiddleware, 
  processProductImages 
} = require('../middleware/uploadMiddleware');

// Use the same async handler for error handling
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/top
 * @desc    Get top rated products
 * @access  Public
 */
router.get('/top', getTopProducts);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', require('../controllers/productController').getFeaturedProducts);

/**
 * @route   GET /api/products/id/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/id/:id', getProductById);

/**
 * @route   GET /api/products/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
router.get('/:slug', getProductBySlug);

/**
 * @route   POST /api/products
 * @desc    Create a product
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadProductImagesMiddleware,
  processProductImages,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required and must be a number').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), uploadProductImagesMiddleware, processProductImages, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteProduct);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Create product review
 * @access  Private
 */
router.post(
  '/:id/reviews',
  protect,
  [
    check('rating', 'Rating is required and must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  createProductReview
);

/**
 * @route   POST /api/products/images
 * @desc    Upload product images without attaching to a specific product
 * @access  Private/Admin
 */
router.post('/images', protect, authorize('admin'), uploadProductImagesMiddleware, processProductImages, asyncHandler(async (req, res) => {
  try {
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images uploaded' 
      });
    }
    
    // Format the images correctly
    const formattedImages = req.body.images.map(img => {
      if (typeof img === 'string') {
        const urlParts = img.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        return {
          public_id: publicId,
          url: img
        };
      }
      return img;
    });
    
    return res.status(200).json({ 
      success: true, 
      images: formattedImages 
    });
  } catch (error) {
    console.error('Error uploading product images:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
}));

/**
 * @route   POST /api/products/:id/images
 * @desc    Upload product images for a specific product
 * @access  Private/Admin
 */
router.post('/:id/images', protect, authorize('admin'), uploadProductImagesMiddleware, processProductImages, (req, res) => {
  res.status(200).json({ success: true, images: req.body.images });
});

module.exports = router;
