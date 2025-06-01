const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const { 
  register, 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  getMe 
} = require('../controllers/authController');

// Middleware
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   POST /api/auth/forgotpassword
 * @desc    Forgot password
 * @access  Public
 */
router.post(
  '/forgotpassword',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  forgotPassword
);

/**
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @desc    Reset password
 * @access  Public
 */
router.put('/resetpassword/:resettoken', resetPassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;
