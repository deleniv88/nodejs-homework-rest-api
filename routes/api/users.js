const express = require("express");
const authRouter = express.Router();

const {register, login, current, logout, userSubscription} = require('../../controllers/auth.controller');
const {tryCatchWrapper} = require("../../helpers/index");

const {validateBody} = require('../../middelwares/index');
const {auth} = require('../../middelwares/auth');
const addUserSchema = require("../../schemas/users");

authRouter.post('/register', validateBody(addUserSchema), tryCatchWrapper(register));
authRouter.post('/login', tryCatchWrapper(login));
authRouter.get('/current', tryCatchWrapper(auth), tryCatchWrapper(current));
authRouter.get('/logout', tryCatchWrapper(auth), tryCatchWrapper(logout));
authRouter.patch('/subscription',tryCatchWrapper(auth),tryCatchWrapper(userSubscription));

module.exports = authRouter

