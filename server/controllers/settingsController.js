const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define a settings schema
const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'shipping', 'payment', 'notification', 'seo'],
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create model if it doesn't exist yet
let Settings;
try {
  Settings = mongoose.model('Settings');
} catch (error) {
  Settings = mongoose.model('Settings', settingsSchema);
}

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public/Admin based on settings type
exports.getAllSettings = asyncHandler(async (req, res, next) => {
  const { category } = req.query;
  
  let filter = {};
  if (category) {
    filter.category = category;
  }

  // Get all settings
  const settings = await Settings.find(filter);

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = {};
    }
    acc[setting.category][setting.key] = setting.value;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: groupedSettings
  });
});

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public/Admin based on setting type
exports.getSettingByKey = asyncHandler(async (req, res, next) => {
  const setting = await Settings.findOne({ key: req.params.key });

  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key: ${req.params.key}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: setting
  });
});

// @desc    Create or update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const { settings } = req.body;

  if (!settings || typeof settings !== 'object') {
    return next(new ErrorResponse('Invalid settings format', 400));
  }

  const results = [];

  // Process each setting
  for (const [category, categorySettings] of Object.entries(settings)) {
    for (const [key, value] of Object.entries(categorySettings)) {
      // Create or update the setting
      const updatedSetting = await Settings.findOneAndUpdate(
        { key },
        { 
          key, 
          value, 
          category,
          updatedAt: Date.now() 
        },
        { 
          new: true, 
          upsert: true, 
          runValidators: true 
        }
      );

      results.push(updatedSetting);
    }
  }

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private/Admin
exports.deleteSetting = asyncHandler(async (req, res, next) => {
  const setting = await Settings.findOne({ key: req.params.key });

  if (!setting) {
    return next(
      new ErrorResponse(`Setting not found with key: ${req.params.key}`, 404)
    );
  }

  await setting.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload store logo
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
exports.uploadStoreLogo = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.logo) {
    return next(new ErrorResponse('Please upload a logo file', 400));
  }

  const file = req.files.logo;

  // Make sure the file is an image
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
  file.name = `store_logo_${Date.now()}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/store/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    // Update store logo setting
    const logoUrl = `/uploads/store/${file.name}`;
    
    await Settings.findOneAndUpdate(
      { key: 'storeLogo' },
      { 
        key: 'storeLogo', 
        value: logoUrl, 
        category: 'general',
        updatedAt: Date.now() 
      },
      { 
        new: true, 
        upsert: true
      }
    );

    res.status(200).json({
      success: true,
      data: {
        logoUrl
      }
    });
  });
});

// @desc    Get initial store setup status
// @route   GET /api/settings/setup-status
// @access  Public
exports.getSetupStatus = asyncHandler(async (req, res, next) => {
  // Check if essential settings are configured
  const essentialSettings = [
    'storeName',
    'storeEmail',
    'storePhone',
    'storeAddress',
    'currency'
  ];

  const settingsCount = await Settings.countDocuments({
    key: { $in: essentialSettings }
  });

  // Check if there are products
  const Product = mongoose.model('Product');
  const productsCount = await Product.countDocuments();

  // Check if there are categories
  const Category = mongoose.model('Category');
  const categoriesCount = await Category.countDocuments();

  // Check if admin user exists
  const User = mongoose.model('User');
  const adminExists = await User.exists({ role: { $in: ['admin', 'super-admin'] } });

  const setupStatus = {
    settingsConfigured: settingsCount === essentialSettings.length,
    productsAdded: productsCount > 0,
    categoriesAdded: categoriesCount > 0,
    adminConfigured: adminExists,
    setupComplete: 
      settingsCount === essentialSettings.length && 
      productsCount > 0 && 
      categoriesCount > 0 && 
      adminExists
  };

  res.status(200).json({
    success: true,
    data: setupStatus
  });
});
