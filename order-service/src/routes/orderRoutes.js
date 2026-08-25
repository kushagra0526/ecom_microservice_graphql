const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, orderController.createOrder);       // protected — mutates data
router.get('/', auth, orderController.getAllOrders);        // protected — user-specific data
router.get('/:id', auth, orderController.getOrderById);    // protected — user-specific data

module.exports = router;
