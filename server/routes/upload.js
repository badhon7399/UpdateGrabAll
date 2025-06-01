const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const { 
  uploadProductImagesMiddleware,
  processProductImages 
} = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/upload/images
 * @desc    Upload images (general purpose)
 * @access  Private/Admin
 */
router.post('/images', 
  protect, 
  authorize('admin'), 
  uploadProductImagesMiddleware, 
  processProductImages, 
  (req, res) => {
    try {
      if (!req.body.images || req.body.images.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No images uploaded' 
        });
      }
      
      // Return the uploaded image URLs
      res.status(200).json({
        success: true,
        images: req.body.images
      });
    } catch (error) {
      console.error('Error handling image upload:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing uploaded images',
        error: error.message
      });
    }
  }
);

module.exports = router;
