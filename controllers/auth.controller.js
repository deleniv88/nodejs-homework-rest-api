const { User, getUserByEmail, updateUserSubscription } = require("../models/users");
// generate Errors
const { Conflict, Unauthorized } = require("http-errors");
// library for the encryption password for user when register
const bcrypt = require("bcrypt");
// library for the generation token for user when login
const jwt = require("jsonwebtoken");
// uses for upload avatar for User
const path = require('path');
const fs = require('fs/promises');
// library for the generation avatar for user when register
const gravatar = require('gravatar');
const Jimp = require('jimp');


async function register(req, res, next) {
    const { email, password } = req.body;
    // ecrtped password for User when register  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // generate avatar for User by emeail when register
    const avatarGravar = gravatar.url(email);
    try {
        // create new User
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: avatarGravar
        });

        res.status(201).json({
            data: {
                user: {
                    id: savedUser._id,
                    email,
                    subscription: savedUser.subscription,
                    avatarURL: savedUser.avatarURL
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
        // generate token for user when login
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        await User.findByIdAndUpdate(storedUser._id, token)
        res.json({
            data: {
                token,
                payload,
                user: {
                    email,
                    subscription: storedUser.subscription,
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
                subscription,
            }
        }
    });
}

async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: " " });
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

async function uploadAvatar(req, res, next) {
    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, '../tmp', filename);
    const publicPath = path.resolve(__dirname, '../public/avatars', filename)

    try {
        const cropAvatar = await Jimp.read(tmpPath)
        await cropAvatar.autocrop()
            .cover(250, 250,
                Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE)
            .writeAsync(tmpPath)

        await fs.rename(tmpPath, publicPath)

        const usersId = req.user._id;
        const imageName = `/public/avatars/${usersId}_${filename}`

        const user = await User.findById(usersId);
        user.avatarURL = `/public/avatars/${filename}`
        await user.save()

        return res.json({
            data: {
                avatarURL: imageName
            }
        });
    } catch (error) {
        await fs.unlink(tmpPath)
    }
}

module.exports = {
    register,
    login,
    current,
    logout,
    userSubscription,
    uploadAvatar
}
