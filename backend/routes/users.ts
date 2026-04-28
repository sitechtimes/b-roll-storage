import express from "express";
import { requireAuth } from "../middleware/validateAuth";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const userController = require("../controllers/userController");
const router = express.Router();

router.get(`/`, requireRole(UserRole.Admin), userController.index);
router.get(`/filter`, requireRole(UserRole.Admin), userController.getUser);
router.get(`/:id`, requireAuth, userController.getUserById);
router.delete(`/:id`, requireRole(UserRole.Admin), userController.deleteUser);
router.delete(`/`, requireRole(UserRole.Admin), userController.deleteAllUsers);
router.patch("/:id", requireAuth, userController.updateUser);
router.patch("/password/:id", requireAuth, userController.changePassword);

module.exports = router;
