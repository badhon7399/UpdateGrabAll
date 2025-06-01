const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');

// Initialize Stripe only if API key is available
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn('Stripe API key not found. Stripe payments will not work.');
  }
} catch (error) {
  console.error('Error initializing Stripe:', error.message);
}

// @desc    Process payment with Stripe
// @route   POST /api/payments/stripe
// @access  Private
exports.processStripePayment = asyncHandler(async (req, res, next) => {
  const { paymentMethodId, orderId, amount } = req.body;

  // Verify the order exists and belongs to the user
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to process payment for this order', 401));
  }
  
  // Verify the order is not already paid
  if (order.isPaid) {
    return next(new ErrorResponse('Order is already paid', 400));
  }
  
  // Verify the payment amount matches the order total
  const orderAmount = Math.round(order.totalPrice * 100); // Convert to cents
  if (orderAmount !== amount) {
    return next(new ErrorResponse('Payment amount does not match order total', 400));
  }

  if (!stripe) {
    return next(new ErrorResponse('Stripe is not configured. Please contact the administrator.', 500));
  }
  
  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Order payment for ${order._id}`,
      metadata: {
        order_id: order._id.toString(),
        user_id: req.user.id
      }
    });

    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };

    await order.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        order: order
      }
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Process PayPal payment
// @route   POST /api/payments/paypal
// @access  Private
exports.processPayPalPayment = asyncHandler(async (req, res, next) => {
  const { orderID, payerID, paymentID, orderId } = req.body;

  // Verify the order exists and belongs to the user
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to process payment for this order', 401));
  }
  
  // Verify the order is not already paid
  if (order.isPaid) {
    return next(new ErrorResponse('Order is already paid', 400));
  }

  // Update order payment status
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: paymentID,
    status: 'COMPLETED',
    update_time: new Date().toISOString(),
    email_address: req.user.email,
    paypalOrderId: orderID,
    payerId: payerID
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get Stripe public key
// @route   GET /api/payments/stripe/config
// @access  Public
exports.getStripeConfig = asyncHandler(async (req, res, next) => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    return next(new ErrorResponse('Stripe is not configured', 500));
  }
  
  res.status(200).json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    }
  });
});

// @desc    Get PayPal client ID
// @route   GET /api/payments/paypal/config
// @access  Public
exports.getPayPalConfig = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      clientId: process.env.PAYPAL_CLIENT_ID
    }
  });
});

// @desc    Process cash on delivery order
// @route   POST /api/payments/cod
// @access  Private
exports.processCashOnDelivery = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  // Verify the order exists and belongs to the user
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }
  
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to process this order', 401));
  }
  
  // Set order status to processing for COD
  order.status = 'processing';
  order.paymentMethod = 'Cash on Delivery';
  
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Process payment refund
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.processRefund = asyncHandler(async (req, res, next) => {
  const { orderId, amount, reason } = req.body;

  // Verify the order exists
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }
  
  // Verify the order is paid
  if (!order.isPaid) {
    return next(new ErrorResponse('Order is not paid yet', 400));
  }
  
  // Verify order has payment ID
  if (!order.paymentResult || !order.paymentResult.id) {
    return next(new ErrorResponse('No payment information found for this order', 400));
  }

  try {
    let refund;
    
    // Process refund based on payment method
    if (order.paymentMethod === 'Stripe') {
      if (!stripe) {
        return next(new ErrorResponse('Stripe is not configured. Please contact the administrator.', 500));
      }
      refund = await stripe.refunds.create({
        payment_intent: order.paymentResult.id,
        amount: amount || undefined, // If amount is not provided, refund full amount
        reason: 'requested_by_customer'
      });
    } else {
      // For PayPal or other methods, just record the refund in our system
      // In a real application, you would use the PayPal SDK to process refunds
      refund = {
        id: `manual-refund-${Date.now()}`,
        status: 'completed',
        amount: amount || order.totalPrice
      };
    }

    // Update order with refund information
    order.isRefunded = true;
    order.refundedAt = Date.now();
    order.refundResult = {
      id: refund.id,
      status: refund.status,
      amount: refund.amount / 100, // Convert from cents
      reason: reason || 'Customer requested'
    };

    await order.save();

    res.status(200).json({
      success: true,
      data: {
        refund,
        order
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Refund processing error: ${error.message}`, 400));
  }
});
