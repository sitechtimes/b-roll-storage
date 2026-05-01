import express from "express";
import { requireRole } from "../middleware/validateRole";
import { UserRole } from "../utils/userRole";
const mediaController = require("../controllers/mediaController");
const router = express.Router();
const upload = require("../middleware/upload");

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);
router.post(
  "/",
  requireRole(UserRole.Admin),
  upload.array("photos", 10),
  mediaController.createMedia,
);
router.delete("/:id", requireRole(UserRole.Admin), mediaController.deleteMedia);
router.delete(`/`, requireRole(UserRole.Admin), mediaController.deleteAllMedia);
router.patch("/:id", requireRole(UserRole.Admin), mediaController.updateMedia);

module.exports = router;
