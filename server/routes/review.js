const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), getReviews);

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get reviews for a product
 * @access  Public
 */
router.get('/product/:productId', (req, res, next) => {
  req.params.productId = req.params.productId;
  getReviews(req, res, next);
});

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', getReview);

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    check('rating', 'Rating is required and must be a number between 1 and 5').isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
    check('productId', 'Product ID is required').not().isEmpty()
  ],
  (req, res, next) => {
    req.params.productId = req.body.productId;
    addReview(req, res, next);
  }
);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private
 */
router.put(
  '/:id',
  protect,
  updateReview
);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private
 */
router.delete(
  '/:id',
  protect,
  deleteReview
);

module.exports = router;
