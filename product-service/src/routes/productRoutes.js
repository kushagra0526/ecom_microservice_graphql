const express = require('express');
const Joi = require('joi');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const createSchema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    price: Joi.number().positive().required(),
});

const updateSchema = Joi.object({
    name: Joi.string().trim().min(1),
    description: Joi.string().trim().min(1),
    price: Joi.number().positive(),
}).min(1);

const router = express.Router();

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductBody'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 */
router.post('/', auth, validate(createSchema), createProduct);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products (paginated)
 *     tags: [Products]
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
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductList'
 */
router.get('/', getProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *     responses:
 *       200:
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateBody'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Product not found
 */
router.put('/:id', auth, validate(updateSchema), updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Product not found
 */
router.delete('/:id', auth, deleteProduct);

module.exports = router;
