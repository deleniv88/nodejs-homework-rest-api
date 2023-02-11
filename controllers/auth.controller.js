const { User, getUserByEmail, updateUserSubscription } = require("../models/users");
// generate Errors
const { Conflict, Unauthorized, NotFound } = require("http-errors");
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
const sendVerification = require("../middelwares/mailVerification");
// for generation user verificationToken
const { v4 } = require("uuid");
// user registration
async function register(req, res, next) {
    const { email, password } = req.body;
    // ecrtped password for User when register  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // generate avatar for User by emeail when register
    const avatarGravar = gravatar.url(email);
    try {
        const verificationToken = v4();

        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL: avatarGravar,
            verify: false,
            verificationToken
        });
        // send email for verification
        await sendVerification({
            to: email,
            subject: "Please verify",
            html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`
        })

        res.status(201).json({
            data: {
                user: {
                    id: savedUser._id,
                    email,
                    subscription: savedUser.subscription,
                    avatarURL: savedUser.avatarURL,
                    verify: savedUser.verify,
                    verificationToken: savedUser.verificationToken,
                }
            }
        });
    }
    catch (error) {
        if (error.message.includes("E11000 duplicate key error collection"));
        throw Conflict("Email in use");
    }
}
// user login
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
// find current user
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
// user logout
async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: " " });
    return res.status(204).json()
}
// update user subscription
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
// update users avatar
async function uploadAvatar(req, res, next) {
    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, '../tmp', filename);
    const publicPath = path.resolve(__dirname, '../public/avatars', filename);

    try {
        const cropAvatar = await Jimp.read(tmpPath);
        await cropAvatar.autocrop()
            .cover(250, 250,
                Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE)
            .writeAsync(tmpPath);

        await fs.rename(tmpPath, publicPath);

        const usersId = req.user._id;
        const imageName = `/public/avatars/${usersId}_${filename}`;

        const user = await User.findById(usersId);
        user.avatarURL = `/public/avatars/${filename}`;
        await user.save();

        return res.json({
            data: {
                avatarURL: imageName
            }
        });

    } catch (error) {
        await fs.unlink(tmpPath);
    }
}
// verify users email
async function verifyEmail(req, res, next) {

    const { verificationToken } = req.params;

    const user = await User.findOne({
        verificationToken: verificationToken
    });

    if (!user) {
        throw NotFound('User not found')
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: null
    });

    return res.json({
        message: "Verification successful"
    });
}
// check if user is verify
async function checkVerify(req, res, next) {
    const { email } = req.body;

    const storedUser = await getUserByEmail(email);

    if (!email) {
        return res.status(400).json({
            message: 'Missing required field email'
        });
    }

    try {
        if (storedUser.verify === false) {

            await sendVerification({
                to: email,
                subject: "Please verify",
                html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${storedUser.verificationToken}">Confirm email</a>`
            });

            return res.json({
                data: {
                    message: 'Verification mail sent'
                }
            });
        }

        return res.json({
            message: 'Verification has already been passed'
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    current,
    logout,
    userSubscription,
    uploadAvatar,
    verifyEmail,
    checkVerify
}
