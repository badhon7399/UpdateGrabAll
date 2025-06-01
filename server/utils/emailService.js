const nodemailer = require('nodemailer');

// Create email templates
const createOrderConfirmationEmail = (order) => {
  const { _id, orderItems, shippingAddress, totalPrice, paymentMethod } = order;
  
  const itemsList = orderItems.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">৳${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">৳${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50;">GrabAll</h1>
        <p>Your Bangladeshi E-Commerce Platform</p>
      </div>
      
      <h2>Order Confirmation</h2>
      <p>Thank you for your order! Your order has been received and is being processed.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${_id}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      </div>
      
      <h3>Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>৳${totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <h3>Shipping Address</h3>
      <p>
        ${shippingAddress.fullName}<br>
        ${shippingAddress.address}<br>
        ${shippingAddress.city}, ${shippingAddress.postalCode}<br>
        ${shippingAddress.country}<br>
        Phone: ${shippingAddress.phone}
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
        <p>If you have any questions, please contact our customer support at support@graball.com</p>
        <p>&copy; ${new Date().getFullYear()} GrabAll. All rights reserved.</p>
      </div>
    </div>
  `;
};

const createOrderNotificationForAdmin = (order, user) => {
  const { _id, orderItems, totalPrice, paymentMethod } = order;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2>New Order Notification</h2>
      <p>A new order has been placed on GrabAll.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${_id}</p>
        <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total Amount:</strong> ৳${totalPrice.toFixed(2)}</p>
        <p><strong>Items:</strong> ${orderItems.length}</p>
      </div>
      
      <p>Please log in to the admin dashboard to view and process this order.</p>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://graball.com/admin/dashboard" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
      </div>
    </div>
  `;
};

// Send email function
const sendEmail = async (options) => {
  try {
    // Create transporter with specific Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.SMTP_GMAIL_USER,
        pass: process.env.SMTP_GMAIL_PASS
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
    
    // Mail options
    const mailOptions = {
      from: `"GrabAll" <${process.env.SMTP_GMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };
    
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = {
  sendEmail,
  createOrderConfirmationEmail,
  createOrderNotificationForAdmin
};
