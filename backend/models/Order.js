// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },

  // Product Info (denormalized for easier display on thank you page)
  product: {
      id: { type: String, required: true }, // Using the mock product ID or mongoose.Schema.Types.ObjectId if Product is in DB
      name: { type: String, required: true },
      price: { type: Number, required: true },
      selectedVariant: { type: String }, // e.g., "Color: Red, Size: M"
      quantity: { type: Number, required: true },
  },

  subtotal: { type: Number, required: true },
  total: { type: Number, required: true }, // Could be same as subtotal if no tax/shipping

  // Payment Info (Simulated - DO NOT STORE REAL CARD DETAILS)
  cardNumberLast4: { type: String }, // Store only last 4 digits
  expiryDate: { type: String }, // e.g., "MM/YY"

  transactionStatus: {
    type: String,
    enum: ['approved', 'declined', 'failed'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);