import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { UserPayload } from "../middleware/currentUser";
import { getFileType } from "../utils/getFileType";

interface AuthenticatedRequest extends Request {
  currentUser?: UserPayload;
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
    const type = getFileType(file.mimetype, file.originalname);

    let folder = "other";
    if (type === "image") folder = "images";
    if (type === "video") folder = "videos";

    const uploadPath = path.join(uploadsDir, folder);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (
    req: AuthenticatedRequest,
    file: Express.Multer.File,
    cb,
  ): void => {
    if (!req.currentUser) {
      return cb(new Error("User not authenticated"), "");
    }

    const ext = path.extname(file.originalname);
    const filename = `user-${req.currentUser.id}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

/**
 * File filter
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const type = getFileType(file.mimetype, file.originalname);

  if (type) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

/**
 * Multer instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
