"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getFileType_1 = require("../utils/getFileType");
/**
 * Ensure uploads directory exists
 */
const uploadsDir = path_1.default.join(__dirname, "../uploads");
fs_1.default.mkdirSync(uploadsDir, { recursive: true });
/**
 * Multer storage configuration
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const type = (0, getFileType_1.getFileType)(file.mimetype, file.originalname);
        let folder = "other";
        if (type === "image")
            folder = "images";
        if (type === "video")
            folder = "videos";
        const uploadPath = path_1.default.join(uploadsDir, folder);
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        if (!req.currentUser) {
            return cb(new Error("User not authenticated"), "");
        }
        const ext = path_1.default.extname(file.originalname);
        const filename = `user-${req.currentUser.id}-${Date.now()}${ext}`;
        cb(null, filename);
    },
});
/**
 * File filter
 */
const fileFilter = (req, file, cb) => {
    const type = (0, getFileType_1.getFileType)(file.mimetype, file.originalname);
    if (type) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image and video files are allowed"));
    }
};
/**
 * Multer instance
 */
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
exports.default = upload;
