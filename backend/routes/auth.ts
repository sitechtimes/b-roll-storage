import express from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";
const authController = require("../controllers/authController");
const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password")
      .trim()
      .isLength({ min: 8, max: 24 })
      .withMessage("Password must be between 8 and 24 characters"),
  ],
  validateRequest,
  authController.signUp,
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must have a password"),
  ],
  validateRequest,
  authController.signIn,
);

router.post("/signout", authController.signOut);

module.exports = router;
