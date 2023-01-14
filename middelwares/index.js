function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(res.status(400).json({ message: error.message }))
        }
        return next()
    }
}

module.exports = validateBody