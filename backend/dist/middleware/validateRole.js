"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const validateAuth_1 = require("./validateAuth");
const requireRole = (role) => [
    ...validateAuth_1.requireAuth,
    async (req, res, next) => {
        if (!req.currentUser)
            return void res.sendStatus(401);
        if (req.currentUser.role === role) {
            next();
        }
        else {
            res.sendStatus(403).json("Admin required");
        }
    },
];
exports.requireRole = requireRole;
