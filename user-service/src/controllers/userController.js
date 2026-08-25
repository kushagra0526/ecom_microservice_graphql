const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { emitUserRegisteredEvent } = require('../events/userProducer');

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ message: 'Username, email, and password are required' });

        const existingUsername = await User.findOne({ username });
        if (existingUsername)
            return res.status(409).json({ message: 'Username already in use' });

        const existingEmail = await User.findOne({ email });
        if (existingEmail)
            return res.status(409).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Emit Kafka event (non-blocking)
        emitUserRegisteredEvent({ id: newUser._id, username, email }).catch(err =>
            console.error('Failed to emit user event:', err)
        );

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', userId: user._id, token });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, getUsers, getUserById };
