"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const currentUser_1 = require("../middleware/currentUser");
const authController = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/signup", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email is required"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 8, max: 24 })
        .withMessage("Password must be between 8 and 24 characters"),
], validateRequest_1.validateRequest, authController.signUp);
router.post("/signin", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email must be valid"),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("You must have a password"),
], validateRequest_1.validateRequest, authController.signIn);
router.post("/signout", authController.signOut);
// after signup, POST to get a token
router.post("/verify", currentUser_1.currentUser, authController.sendVerify);
// link from email uses GET
router.get("/verify", authController.verify);
router.post("/send-reset", currentUser_1.currentUser, authController.sendReset);
router.post("/reset-password", currentUser_1.currentUser, authController.resetPassword);
module.exports = router;
