import express from "express";
import { requireAuth } from "../middleware/validateAuth";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const userController = require("../controllers/userController");
const router = express.Router();

router.get(`/`, requireAuth, requireRole(UserRole.Admin), userController.index);
router.get(`/filter`, userController.getUser);
router.get("/:id", userController.getUserById);

module.exports = router;
