const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');
const emailService = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  console.log('Order creation started');
  console.log('Request body:', JSON.stringify(req.body));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  console.log('Order items:', JSON.stringify(orderItems));
  console.log('User ID:', req.user ? req.user.id : 'No user ID found');

  if (orderItems && orderItems.length === 0) {
    console.log('No order items');
    return next(new ErrorResponse('No order items', 400));
  }

  try {
    // Verify product prices and update stock
    for (const item of orderItems) {
      console.log('Processing item:', JSON.stringify(item));
      const product = await Product.findById(item.product);
      
      if (!product) {
        console.log('Product not found:', item.product);
        return next(
          new ErrorResponse(`Product not found with id: ${item.product}`, 404)
        );
      }
      
      // Verify price
      console.log('Price check:', product.price, item.price);
      if (product.price !== item.price) {
        console.log('Price mismatch:', product.price, item.price);
        return next(
          new ErrorResponse(`Product price has changed. Please refresh your cart.`, 400)
        );
      }
      
      // Check stock
      const itemQuantity = item.quantity || 0;
      console.log('Stock check:', product.countInStock, itemQuantity);
      if (product.countInStock < itemQuantity) {
        console.log('Insufficient stock:', product.name, product.countInStock);
        return next(
          new ErrorResponse(`Insufficient stock for ${product.name}. Available: ${product.countInStock}`, 400)
        );
      }
      
      // Update stock
      product.countInStock -= itemQuantity;
      await product.save();
      console.log('Stock updated for product:', product._id);
    }

    // Create order
    console.log('Creating order object');
    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    try {
      console.log('Saving order to database');
      const createdOrder = await order.save();
      console.log('Order saved successfully:', createdOrder._id);

      // Send order notification email to admin
      try {
        // First get the full user details to include in the admin notification
        const user = await User.findById(req.user.id);
        
        // Get admin email from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        
        if (!adminEmail) {
          console.warn('Admin email not configured. Skipping order notification email.');
        } else {
          // Generate the email content for admin notification
          const emailHtml = emailService.createOrderNotificationForAdmin(createdOrder, user);
          
          // Send the email notification to admin
          await emailService.sendEmail({
            email: adminEmail,
            subject: `New Order Notification - Order #${createdOrder._id}`,
            html: emailHtml
          });
          
          // Also send confirmation email to customer
          const confirmationHtml = emailService.createOrderConfirmationEmail(createdOrder);
          await emailService.sendEmail({
            email: user.email,
            subject: 'Your Order Confirmation - GrabAll',
            html: confirmationHtml
          });
          
          console.log('Order notification emails sent successfully');
        }
      } catch (emailError) {
        // Log the error but don't stop the order process
        console.error('Failed to send order notification email:', emailError);
      }

      res.status(201).json({
        success: true,
        data: createdOrder
      });
    } catch (error) {
      console.error('Error creating order:', error);
      next(error);
    }
  } catch (error) {
    console.error('Error processing order items:', error);
    next(error);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'orderItems.product',
      select: 'name image'
    });

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the logged-in user is the owner of the order or an admin
  if (
    order.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super-admin'
  ) {
    return next(
      new ErrorResponse(`Not authorized to access this order`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .populate({
      path: 'orderItems.product',
      select: 'name image'
    });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
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
  query = Order.find(JSON.parse(queryStr))
    .populate('user', 'id name')
    .populate({
      path: 'orderItems.product',
      select: 'name image'
    });

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    
    // Find users matching the search term
    const users = await User.find({
      name: searchRegex
    }).select('_id');
    
    const userIds = users.map(user => user._id);
    
    query = query.find({
      $or: [
        { _id: req.query.search }, // Search by order ID
        { user: { $in: userIds } } // Search by user name
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
  const total = await Order.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const orders = await query;

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

  // Calculate summary stats for admin dashboard
  const totalSales = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const totalOrderCount = await Order.countDocuments();
  const paidOrderCount = await Order.countDocuments({ isPaid: true });
  const deliveredOrderCount = await Order.countDocuments({ isDelivered: true });

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination,
    totalPages: Math.ceil(total / limit),
    data: orders,
    summary: {
      totalSales: totalSales.length > 0 ? totalSales[0].total : 0,
      totalOrders: totalOrderCount,
      paidOrders: paidOrderCount,
      deliveredOrders: deliveredOrderCount
    }
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if order is already paid
  if (order.isPaid) {
    return next(new ErrorResponse('Order is already paid', 400));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if order is paid
  if (!order.isPaid) {
    return next(new ErrorResponse('Order has not been paid yet', 400));
  }

  // Check if order is already delivered
  if (order.isDelivered) {
    return next(new ErrorResponse('Order is already delivered', 400));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  const { status } = req.body;

  // Validate status
  const validStatuses = [
    'pending', 
    'processing', 
    'shipped', 
    'delivered', 
    'cancelled'
  ];
  
  if (!validStatuses.includes(status)) {
    return next(
      new ErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400)
    );
  }

  // Update status and related fields
  order.status = status;
  
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  
  if (status === 'cancelled') {
    // If order is cancelled, restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      }
    }
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the logged-in user is the owner of the order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to cancel this order`, 401)
    );
  }

  // Check if order can be cancelled
  if (order.isDelivered) {
    return next(
      new ErrorResponse('Cannot cancel an order that has been delivered', 400)
    );
  }

  if (order.status === 'cancelled') {
    return next(new ErrorResponse('Order is already cancelled', 400));
  }

  // Update order status
  order.status = 'cancelled';

  // Restore product stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock += item.quantity;
      await product.save();
    }
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    data: updatedOrder
  });
});
