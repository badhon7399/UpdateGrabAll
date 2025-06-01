const Product = require('../models/Product');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Remove fields from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Product.find(JSON.parse(queryStr)).populate('category');

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query = query.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  // Get all categories for filtering options
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    count: products.length,
    pagination,
    totalPages: Math.ceil(total / limit),
    data: products,
    categories
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with slug of ${req.params.slug}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/id/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    // Add user to req.body
    req.body.user = req.user.id;
    
    // Generate slug from product name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      + '-' + Date.now().toString().slice(-4); // Add timestamp suffix for uniqueness
    
    // Add slug to request body
    req.body.slug = slug;
    
    // Handle images properly
    if (!req.body.images || !Array.isArray(req.body.images)) {
      req.body.images = [];
    }
    
    // Format images as expected by the Product model
    req.body.images = req.body.images.map(img => {
      // If it's already in the correct format, leave it as is
      if (img && typeof img === 'object' && img.public_id && img.url) {
        return img;
      }
      
      // If it's just a URL string, convert it to the expected format
      if (typeof img === 'string') {
        const urlParts = img.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        return {
          public_id: publicId,
          url: img
        };
      }
      
      return null;
    }).filter(img => img !== null); // Remove any nulls
    
    console.log('Creating product with data:', JSON.stringify(req.body, null, 2));
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Product with this name already exists'
      });
    }
    return next(new ErrorResponse(`Failed to create product: ${error.message}`, 500));
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    return next(
      new ErrorResponse('Product already reviewed by this user', 400)
    );
  }

  // Add review
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user.id
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
    data: product
  });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ featured: true });
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
exports.uploadProductImage = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  const file = req.files.image;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `product_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/products/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    res.status(200).json({
      success: true,
      imageUrl: `/uploads/products/${file.name}`
    });
  });
});
