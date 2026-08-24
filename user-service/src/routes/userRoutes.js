const express = require('express');
const { registerUser, loginUser, getUsers, getUserById } = require('../controllers/userController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get all users
router.get('/', getUsers);

// Route to get a user by ID
router.get('/:id', getUserById);

module.exports = router;