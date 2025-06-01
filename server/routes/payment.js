const express = require('express');
const router = express.Router();

// Import controller functions
const {
  processStripePayment,
  processPayPalPayment,
  processCashOnDelivery,
  getStripeConfig,
  getPayPalConfig,
  processRefund
} = require('../controllers/paymentController');

// Middleware
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/payments/stripe
 * @desc    Process Stripe payment
 * @access  Private
 */
router.post('/stripe', protect, processStripePayment);

/**
 * @route   GET /api/payments/stripe/config
 * @desc    Get Stripe public key
 * @access  Public
 */
router.get('/stripe/config', getStripeConfig);

/**
 * @route   POST /api/payments/paypal
 * @desc    Process PayPal payment
 * @access  Private
 */
router.post('/paypal', protect, processPayPalPayment);

/**
 * @route   GET /api/payments/paypal/config
 * @desc    Get PayPal client ID
 * @access  Public
 */
router.get('/paypal/config', getPayPalConfig);

/**
 * @route   POST /api/payments/cod
 * @desc    Process Cash on Delivery order
 * @access  Private
 */
router.post('/cod', protect, processCashOnDelivery);

/**
 * @route   POST /api/payments/refund
 * @desc    Process payment refund
 * @access  Private/Admin
 */
router.post('/refund', protect, processRefund);

module.exports = router;
