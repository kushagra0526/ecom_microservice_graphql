const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET || 'fallback_secret');
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
