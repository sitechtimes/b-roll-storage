import express from "express";
import { requireAuth } from "../middleware/validateAuth";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const mediaController = require("../controllers/mediaController");
const router = express.Router();

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);
router.post("/", requireRole(UserRole.Admin), mediaController.createMedia);
router.delete("/:id", requireRole(UserRole.Admin), mediaController.deleteMedia);
router.delete(`/`, requireRole(UserRole.Admin), mediaController.deleteAllMedia);
router.patch("/:id", requireRole(UserRole.Admin), mediaController.updateMedia);

module.exports = router;
