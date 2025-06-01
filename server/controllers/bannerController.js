const Banner = require('../models/Banner');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');
const path = require('path');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = asyncHandler(async (req, res, next) => {
  // Optionally filter by active status
  const query = req.query.active === 'true' ? { active: true } : {};
  
  // Get banners ordered by position
  const banners = await Banner.find(query).sort('position');

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});

// @desc    Get active banners
// @route   GET /api/banners/active
// @access  Public
exports.getActiveBanners = asyncHandler(async (req, res, next) => {
  // Find banners that are active
  const banners = await Banner.find({ active: true }).sort('position');

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
exports.getBannerById = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(
      new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: banner
  });
});

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Prepare banner data with defaults for optional fields
    const bannerData = {
      ...req.body,
      // Set empty defaults for all text fields
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      description: req.body.description || '',
      link: req.body.link || '',
      buttonText: req.body.buttonText || '',
      // Explicitly set showButton property to ensure it's correct
      showButton: req.body.showButton !== undefined ? req.body.showButton : true,
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Banner creation error:', error);
    return next(new ErrorResponse(`Failed to create banner: ${error.message}`, 500));
  }
});

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = asyncHandler(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(
      new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404)
    );
  }

  banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: banner
  });
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(
      new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404)
    );
  }

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload banner image
// @route   POST /api/banners/upload
// @access  Private/Admin
exports.uploadBannerImage = asyncHandler(async (req, res, next) => {
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
  file.name = `banner_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/banners/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    res.status(200).json({
      success: true,
      imageUrl: `/uploads/banners/${file.name}`
    });
  });
});
