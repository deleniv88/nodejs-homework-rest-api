const { Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

async function auth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);
        req.user = user;

    if (type !== 'Bearer') {
        throw Unauthorized("Not authorized");
    }

    if (!token || !user.token)  {
        throw Unauthorized("Not authorized");
    }

    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            throw Unauthorized("Not authorized");
        } throw error;
    }
    next();
}

module.exports = {
    auth
}