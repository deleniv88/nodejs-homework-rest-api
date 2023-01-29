const { User, getUserByEmail, updateUserSubscription } = require("../models/users");
const bcrypt = require("bcrypt");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const savedUser = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            data: {
                user: {
                    email,
                    subscription: savedUser.subscription
                }
            }
        });
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error collection"));
        throw Conflict("Email in use");
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const storedUser = await getUserByEmail(email);

        if (!storedUser) {
            throw Unauthorized("Email or password is not valid");
        }

        const isPasswordValid = await bcrypt.compare(password, storedUser.password);

        if (!isPasswordValid) {
            throw Unauthorized("Email or password is not valid");
        }

        const payload = { id: storedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.findByIdAndUpdate(storedUser._id, token)
        console.log(token);
        res.json({
            data: {
                token,
                user: {
                    email,
                    subscription: storedUser.subscription
                }
            }
        });

    } catch (error) {
        next(error);
    }
}

async function current(req, res, next) {
    const { user } = req;
    const { email, subscription } = user;

    return res.status(200).json({
        data: {
            user: {
                email,
                subscription
            }
        }
    });
}

async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: " " });
    console.log(req.user);
    return res.status(204).json()
}

async function userSubscription(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: "missing fields subscription",
        });
    }
    const { _id } = req.user;
    const { subscription } = req.body;
    const newSubscription = updateUserSubscription(_id, { subscription });

    if (!newSubscription) {
        res.status(400).json({
            message: "Not found"
        });
    }
    res.status(200).json({ data: subscription, status: "success" });
}

module.exports = {
    register,
    login,
    current,
    logout,
    userSubscription
}