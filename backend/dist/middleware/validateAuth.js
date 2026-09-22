"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const user_1 = require("../models/user");
const currentUser_1 = require("./currentUser");
/** checks that the user's JWT is valid, and that they are verified */
exports.requireAuth = [
    currentUser_1.currentUser,
    async (req, res, next) => {
        if (!req.currentUser)
            return void res.sendStatus(401);
        const user = await user_1.User.findById(req.currentUser.id);
        if (!user || !user.verified)
            return void res.sendStatus(401);
        next();
    },
];
