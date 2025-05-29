// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
// const Product = require('../models/Product'); // If using DB for product

// Mock product data (Static JSON)
const mockProduct = {
  _id: 'prod_12345', // Simulate a DB ID
  name: 'Converse Chuck Taylor All Star II Hi',
  description: 'The Converse Chuck Taylor All Star II Hi retains the iconic Chuck Taylor All Star silhouette you know and love, but is built for more to better meet the demands of your "on the go" lifestyle.',
  price: 75.00,
  imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replace with a real or placeholder image
  variants: [
    { name: 'Color', options: ['Black', 'White', 'Red'] },
    { name: 'Size', options: ['US 7', 'US 8', 'US 9', 'US 10'] }
  ],
  inventory: 50, // Initial inventory
};

// GET /api/product/details
router.get('/details', async (req, res) => {
  try {
    // If using DB:
    // let product = await Product.findOne(); // Find first product or by ID
    // if (!product) { // Seed if not found
    //   product = new Product(mockProduct);
    //   await product.save();
    // }
    // res.json(product);

    // For static mock:
    res.json(mockProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

module.exports = router;