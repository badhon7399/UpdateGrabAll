const { 
  uploadProductImages,
  uploadCategoryImage,
  uploadBannerImage,
  uploadAvatar
} = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

// Middleware for uploading product images (up to 5 images)
exports.uploadProductImagesMiddleware = uploadProductImages.array('images', 5);

// Middleware for uploading category image (single image)
exports.uploadCategoryImageMiddleware = uploadCategoryImage.single('image');

// Middleware for uploading banner image (single image)
exports.uploadBannerImageMiddleware = uploadBannerImage.single('image');

// Middleware for uploading user avatar (single image)
exports.uploadAvatarMiddleware = uploadAvatar.single('avatar');

// Process uploaded product images and add to req.body
exports.processProductImages = asyncHandler(async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      // Still allow the request to continue, but with a warning in logs
      console.warn('No files uploaded for processProductImages middleware');
      return next();
    }
    
    // Extract image URLs from Cloudinary response
    req.body.images = req.files.map(file => {
      if (!file || !file.path) {
        console.error('Invalid file object in processProductImages:', file);
        return null;
      }
      return file.path;
    }).filter(path => path !== null); // Remove any null values
    
    next();
  } catch (error) {
    console.error('Error processing product images:', error);
    req.body.images = []; // Provide an empty array as fallback
    next();
  }
});

// Process uploaded category image and add to req.body
exports.processCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  // Extract image URL from Cloudinary response
  req.body.image = req.file.path;
  
  next();
});

// Process uploaded banner image and add to req.body
exports.processBannerImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  // Extract image URL from Cloudinary response
  req.body.image = req.file.path;
  
  next();
});

// Process uploaded avatar and add to req.body
exports.processAvatar = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  // Extract image URL from Cloudinary response
  req.body.avatar = req.file.path;
  
  next();
});
