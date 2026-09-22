"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = void 0;
const path_1 = __importDefault(require("path"));
const getFileType = (mimetype, originalname) => {
    const ext = path_1.default.extname(originalname).toLowerCase();
    if (mimetype.startsWith("image/") ||
        [".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
        return "image";
    }
    if (mimetype.startsWith("video/") ||
        [".mp4", ".mov", ".avi", ".webm"].includes(ext)) {
        return "video";
    }
    return null;
};
exports.getFileType = getFileType;
