import express from "express";
import { requireAuth } from "../middleware/validateAuth";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const userController = require("../controllers/userController");
const router = express.Router();

router.get(`/`, requireAuth, requireRole(UserRole.Admin), userController.index);
router.get(
  `/filter`,
  requireAuth,
  requireRole(UserRole.Admin),
  userController.getUser,
);
router.get(`/:id`, requireAuth, userController.getUserById);
router.delete(
  `/:id`,
  requireAuth,
  requireRole(UserRole.Admin),
  userController.deleteUser,
);
router.patch("/:id", requireAuth, userController.updateUser);
router.patch(
  "/change-password/:id",
  requireAuth,
  userController.changePassword,
);

module.exports = router;
