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
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Stricter limiter for auth routes — 10 req / 15 min per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.', status: 429 },
});

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), registerUser);
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);

module.exports = router;
