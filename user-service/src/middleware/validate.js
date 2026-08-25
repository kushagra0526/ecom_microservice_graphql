// ponytail: single reusable validator — takes a Joi schema, returns Express middleware
module.exports = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.details.map((d) => d.message),
        });
    }
    next();
};
