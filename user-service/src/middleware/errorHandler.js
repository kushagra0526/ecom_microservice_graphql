// Centralized error handler — must have 4 args for Express to treat it as error middleware
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error', status });
};
