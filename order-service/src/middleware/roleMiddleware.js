// Checks req.user.role (set by authMiddleware) against allowed roles
module.exports = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`
        });
    }
    next();
};
