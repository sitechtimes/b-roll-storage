import express from "express";
const mediaController = require("../controllers/mediaController");
const router = express.Router();

router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);
router.post("/", mediaController.createMedia);
router.delete("/:id", mediaController.deleteMedia);
router.patch("/:id/:operation", mediaController.updateMedia);

module.exports = router;
