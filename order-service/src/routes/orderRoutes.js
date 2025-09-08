const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder); // Create a new order
router.get('/', orderController.getAllOrders); // Get all orders
router.get('/:id', orderController.getOrderById); // Get order by ID

module.exports = router;
