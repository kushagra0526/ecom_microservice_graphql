const express = require('express');
const Joi = require('joi');
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

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);  // public
router.post('/login', validate(loginSchema), loginUser);           // public
router.get('/', auth, getUsers);                                   // protected
router.get('/:id', auth, getUserById);                             // protected

module.exports = router;
