import express from "express";
import { requireAuth } from "../middleware/validateAuth";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const mediaController = require("../controllers/mediaController");
const router = express.Router();

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);
router.post(
  "/",
  requireAuth,
  requireRole(UserRole.Admin),
  mediaController.createMedia,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole(UserRole.Admin),
  mediaController.deleteMedia,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole(UserRole.Admin),
  mediaController.updateMedia,
);

module.exports = router;
