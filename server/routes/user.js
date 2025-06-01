const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const { 
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
  updateProfile,
  updatePassword
} = require('../controllers/userController');

// Middleware
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadAvatarMiddleware, 
  processAvatar 
} = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get('/:id', protect, authorize('admin'), getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), updateUser);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteUser);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile/update',
  protect,
  uploadAvatarMiddleware,
  processAvatar,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  updateProfile
);

/**
 * @route   PUT /api/users/password
 * @desc    Update password
 * @access  Private
 */
router.put(
  '/profile/password',
  protect,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  updatePassword
);

/**
 * @route   POST /api/users/profile/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post(
  '/profile/avatar',
  protect,
  uploadAvatarMiddleware,
  processAvatar,
  (req, res) => {
    res.status(200).json({ success: true, avatar: req.body.avatar });
  }
);

module.exports = router;
