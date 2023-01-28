// const { Unauthorized } = require("http-errors");
// const jwt = require("jsonwebtoken");
// const { User } = require("../models/users");

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

// async function auth(req, res, next) {
//     const authHeader = req.headers.authorization || "";
//     const [type, token] = authHeader.split(" ");

//     try {
//         const { id } = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(id);
//         req.user = user;

//     if (type !== 'Bearer') {
//         throw Unauthorized("Not authorized");
//     }

//     if (!token || !user.token)  {
//         throw Unauthorized("Not authorized");
//     }

//     } catch (error) {
//         if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
//             throw Unauthorized("Not authorized");
//         } throw error;
//     }
//     next();
// }

module.exports = {
    validateBody,
    // auth
}