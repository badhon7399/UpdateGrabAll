const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.productId}`, 404)
      );
    }
    
    return res.status(200).json({
      success: true,
      count: product.reviews.length,
      data: product.reviews
    });
  } else {
    // Get all products with reviews
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .select('name reviews')
      .sort('-reviews.createdAt');
      
    // Extract all reviews from all products
    let allReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          ...review.toObject(),
          productId: product._id,
          productName: product.name
        });
      });
    });
    
    // Sort by date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      count: allReviews.length,
      data: allReviews
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  // Find product containing the review
  const product = await Product.findOne({ 'reviews._id': req.params.id });
  
  if (!product) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Extract the review
  const review = product.reviews.find(
    review => review._id.toString() === req.params.id
  );
  
  res.status(200).json({
    success: true,
    data: {
      ...review.toObject(),
      productId: product._id,
      productName: product.name
    }
  });
});

// @desc    Add review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.productId}`, 404)
    );
  }
  
  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    review => review.user.toString() === req.user.id.toString()
  );
  
  if (alreadyReviewed) {
    return next(
      new ErrorResponse('You have already reviewed this product', 400)
    );
  }
  
  const { rating, comment } = req.body;
  
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    createdAt: Date.now()
  };
  
  product.reviews.push(review);
  
  // Update product rating
  product.numReviews = product.reviews.length;
  
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  
  await product.save();
  
  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Find product containing the review
  let product = await Product.findOne({ 'reviews._id': req.params.id });
  
  if (!product) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Find review index
  const reviewIndex = product.reviews.findIndex(
    review => review._id.toString() === req.params.id
  );
  
  // Check if review exists
  if (reviewIndex === -1) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check review ownership
  if (
    product.reviews[reviewIndex].user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super-admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to update this review', 401)
    );
  }
  
  // Update review
  const { rating, comment } = req.body;
  
  if (rating) product.reviews[reviewIndex].rating = Number(rating);
  if (comment) product.reviews[reviewIndex].comment = comment;
  
  // Update product rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  
  await product.save();
  
  res.status(200).json({
    success: true,
    data: product.reviews[reviewIndex]
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  // Find product containing the review
  let product = await Product.findOne({ 'reviews._id': req.params.id });
  
  if (!product) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Find review index
  const reviewIndex = product.reviews.findIndex(
    review => review._id.toString() === req.params.id
  );
  
  // Check if review exists
  if (reviewIndex === -1) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check review ownership
  if (
    product.reviews[reviewIndex].user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super-admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to delete this review', 401)
    );
  }
  
  // Remove review
  product.reviews.splice(reviewIndex, 1);
  
  // Update product rating or set to 0 if no reviews
  if (product.reviews.length === 0) {
    product.rating = 0;
    product.numReviews = 0;
  } else {
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  }
  
  await product.save();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});
