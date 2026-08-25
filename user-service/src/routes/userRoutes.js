const express = require('express');
const { registerUser, loginUser, getUsers, getUserById } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);   // public
router.post('/login', loginUser);         // public
router.get('/', auth, getUsers);          // protected — user list is sensitive
router.get('/:id', auth, getUserById);    // protected — user-specific data

module.exports = router;
