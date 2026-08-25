const express = require('express');
const Joi = require('joi');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),  // MongoDB ObjectId
    userId: Joi.string().hex().length(24).required(),     // MongoDB ObjectId
    quantity: Joi.number().integer().positive().required(),
});

router.post('/', auth, validate(createSchema), orderController.createOrder);    // protected
router.get('/', auth, orderController.getAllOrders);                             // protected
router.get('/:id', auth, orderController.getOrderById);                         // protected

module.exports = router;
