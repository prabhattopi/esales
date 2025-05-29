// server/controllers/orderController.js
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
const { sendOrderConfirmationEmail, sendTransactionFailedEmail } = require('../utils/emailService');
// const Product = require('../models/Product'); // If product inventory is in DB

// Mock Product Data (or fetch from DB if you have it there)
const mockProductFromStatic = {
    _id: 'prod_12345',
    name: 'Converse Chuck Taylor All Star II Hi',
    price: 75.00,
    inventory: 50, // Ensure this matches the one in productRoutes or DB
};

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName, email, phone, address, city, state, zipCode,
      cardNumber, expiryDate, cvv, // CVV will be used for simulation
      productDetails // { id, name, price, selectedVariant, quantity }
    } = req.body;

    // Basic server-side validation (can be more extensive)
    if (!customerName || !email || !productDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    let transactionStatus = 'failed'; // Default
    let failureReason = 'Unknown error.';

    // Transaction Simulation based on CVV's last digit (as per reference)
    // Note: In a real app, payment processing happens via a gateway API.
    const cvvLastDigit = cvv.toString().slice(-1);
    if (cvvLastDigit === '1') {
      transactionStatus = 'approved';
    } else if (cvvLastDigit === '2') {
      transactionStatus = 'declined';
      failureReason = 'Payment declined by the bank.';
    } else if (cvvLastDigit === '3') {
      transactionStatus = 'failed';
      failureReason = 'Gateway communication error.';
    } else {
      // For any other CVV, treat as a general failure or specific rule
      transactionStatus = 'declined'; 
      failureReason = 'Invalid payment details or simulation rule.';
    }

    const subtotal = productDetails.price * productDetails.quantity;
    const total = subtotal; // Assuming no tax/shipping for simplicity

    const newOrder = new Order({
      orderNumber,
      customerName, email, phone, address, city, state, zipCode,
      product: {
        id: productDetails.id,
        name: productDetails.name,
        price: productDetails.price,
        selectedVariant: productDetails.selectedVariant,
        quantity: productDetails.quantity,
      },
      subtotal,
      total,
      cardNumberLast4: cardNumber.slice(-4), // Store only last 4 digits
      expiryDate, // Store as MM/YY
      transactionStatus,
    });

    await newOrder.save();

    // Update inventory if transaction is approved
    if (transactionStatus === 'approved') {
      // If using a Product model in DB:
      // const product = await Product.findById(productDetails.id);
      // if (product) {
      //   product.inventory -= productDetails.quantity;
      //   await product.save();
      // } else {
      //   console.warn(`Product with ID ${productDetails.id} not found for inventory update.`);
      // }

      // For mock product, this change won't persist across server restarts unless you manage state
      mockProductFromStatic.inventory -= productDetails.quantity;
      console.log(`Inventory for ${mockProductFromStatic.name} updated to ${mockProductFromStatic.inventory}`);

      await sendOrderConfirmationEmail(newOrder);
      res.status(201).json({ 
        message: 'Order created successfully!', 
        orderNumber: newOrder.orderNumber,
        transactionStatus: newOrder.transactionStatus
      });
    } else {
      await sendTransactionFailedEmail({ 
        ...newOrder.toObject(), // Convert Mongoose doc to plain object
        failureReason 
      });
      res.status(400).json({ // Could be 200 with a failed status, or 400/500 depending on failure type
        message: `Order failed: ${failureReason}`, 
        orderNumber: newOrder.orderNumber, // Still provide order number for reference
        transactionStatus: newOrder.transactionStatus
      });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.code === 11000) { // Duplicate key error for orderNumber (highly unlikely with UUID)
        return res.status(500).json({ message: 'Failed to generate unique order number. Please try again.'})
    }
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
};