"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateAuth_1 = require("../middleware/validateAuth");
const validateRole_1 = require("../middleware/validateRole");
const userRole_1 = require("../utils/userRole");
const userController = require("../controllers/userController");
const router = express_1.default.Router();
router.get(`/`, (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), userController.index);
router.get(`/filter`, (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), userController.getUser);
router.get(`/:id`, validateAuth_1.requireAuth, userController.getUserById);
router.delete(`/:id`, (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), userController.deleteUser);
router.delete(`/`, (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), userController.deleteAllUsers);
router.patch("/:id", validateAuth_1.requireAuth, userController.updateUser);
router.patch("/password/:id", validateAuth_1.requireAuth, userController.changePassword);
module.exports = router;
