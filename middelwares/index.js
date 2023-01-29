function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(res.status(400).json({
                message: "There is an error in email or password from Joi validation library or from another library"
            }));
        }
        return next();
    }
}

module.exports = {
    validateBody
}