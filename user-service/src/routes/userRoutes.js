const express = require('express');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, getUsers, getUserById } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const registerSchema = Joi.object({
    username: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('buyer', 'seller').default('buyer'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.', status: 429 },
});

const router = express.Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 userId: { type: string }
 *       400:
 *         description: Missing required fields or validation error
 *       409:
 *         description: Username or email already in use
 *       429:
 *         description: Too many attempts
 */
router.post('/register', authLimiter, validate(registerSchema), registerUser);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 userId: { type: string }
 *                 token: { type: string }
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many attempts
 */
router.post('/login', authLimiter, validate(loginSchema), loginUser);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid token
 */
router.get('/', auth, getUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: User not found
 */
router.get('/:id', auth, getUserById);

module.exports = router;
