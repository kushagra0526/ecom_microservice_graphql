const express = require('express');
const Joi = require('joi');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    userId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().positive().required(),
});

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderBody'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or product/user not found
 *       401:
 *         description: Missing or invalid token
 *       503:
 *         description: A required upstream service is unreachable
 */
// buyer places an order
router.post('/', auth, role('buyer'), validate(createSchema), orderController.createOrder);

// admin views all orders
router.get('/', auth, role('admin'), orderController.getAllOrders);

// admin gets a single order by ID
router.get('/:id', auth, role('admin'), orderController.getOrderById);

// admin updates order status
router.patch('/:id/status', auth, role('admin'), orderController.updateOrderStatus);

module.exports = router;
