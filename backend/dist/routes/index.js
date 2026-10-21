"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediasRoutes = require("./medias");
const usersRoutes = require("./users");
const authRoutes = require("./auth");
const router = express_1.default.Router();
router.use("/medias", mediasRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
module.exports = router;
