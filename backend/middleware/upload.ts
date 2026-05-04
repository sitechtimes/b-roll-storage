import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { UserPayload } from "../middleware/currentUser"; // <-- your shared type

/**
 * Extend Express Request to include currentUser
 */
interface AuthenticatedRequest extends Request {
  currentUser?: UserPayload;
  fileType: "image" | "video";
  files?: Express.Multer.File[];
}

/**
 * Ensure uploads directory exists
 */
const uploadsDir: string = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

/**
 * Multer storage configuration
 */
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "other";

    if (file.mimetype.startsWith("image/")) {
      folder = "images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "videos";
    }

    const uploadPath = path.join(uploadsDir, folder);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (
    req: AuthenticatedRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void => {
    if (!req.currentUser) {
      return cb(new Error("User not authenticated"), "");
    }

    const ext: string = path.extname(file.originalname);
    const filename: string = `user-${req.currentUser.id}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

/**
 * File filter (images only)
 */
const fileFilter = (
  req: AuthenticatedRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (file.mimetype.startsWith("image/")) {
    req.fileType = "image";
    cb(null, true);
  } else if (file.mimetype.startsWith("video/")) {
    req.fileType = "video";
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"));
  }
};

const getFileType = (mimetype: string): "image" | "video" | null => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return null;
};
/**
 * Multer instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
