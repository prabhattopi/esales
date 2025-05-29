require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL })); // Allow requests from frontend
app.use(express.json()); // For parsing application/json

// Basic Route
app.get('/', (req, res) => {
  res.send('E-commerce Backend API Running!');
});
app.use('/api/product', productRoutes);

app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });