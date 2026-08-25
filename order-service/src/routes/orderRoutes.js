const express = require('express');
const Joi = require('joi');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
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
router.post('/', auth, validate(createSchema), orderController.createOrder);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get all orders (paginated)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Max number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Paginated order list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderList'
 *       401:
 *         description: Missing or invalid token
 */
router.get('/', auth, orderController.getAllOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the order
 *     responses:
 *       200:
 *         description: Order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Order not found
 */
router.get('/:id', auth, orderController.getOrderById);

module.exports = router;
