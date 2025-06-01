const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Controllers - will be created later
const {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder
} = require('../controllers/orderController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), getAllOrders);

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged in user orders
 * @access  Private
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', protect, getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    check('orderItems', 'Order items are required').isArray({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('itemsPrice', 'Items price is required').isNumeric(),
    check('taxPrice', 'Tax price is required').isNumeric(),
    check('shippingPrice', 'Shipping price is required').isNumeric(),
    check('totalPrice', 'Total price is required').isNumeric()
  ],
  createOrder
);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

/**
 * @route   PUT /api/orders/:id/pay
 * @desc    Update order to paid
 * @access  Private/Admin
 */
router.put('/:id/pay', protect, updateOrderToPaid);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), cancelOrder);

module.exports = router;
