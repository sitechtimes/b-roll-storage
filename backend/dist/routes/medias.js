"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRole_1 = require("../middleware/validateRole");
const userRole_1 = require("../utils/userRole");
const upload_1 = __importDefault(require("../middleware/upload"));
const mediaController = require("../controllers/mediaController");
const router = express_1.default.Router();
router.get(`/`, mediaController.index);
router.get(`/filter`, mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);
router.post("/", (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), upload_1.default.array("files", 10), mediaController.createMedia);
router.delete("/:id", (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), mediaController.deleteMedia);
router.delete(`/`, (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), mediaController.deleteAllMedia);
router.patch("/:id", (0, validateRole_1.requireRole)(userRole_1.UserRole.Admin), mediaController.updateMedia);
module.exports = router;
