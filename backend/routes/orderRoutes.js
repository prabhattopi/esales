// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders
router.post('/', orderController.createOrder);

// GET /api/orders/:orderNumber
router.get('/:orderNumber', orderController.getOrderDetails);

module.exports = router;