import path from "path";

export const getFileType = (
  mimetype: string,
  originalname: string,
): "image" | "video" | null => {
  const ext = path.extname(originalname).toLowerCase();

  if (
    mimetype.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
  ) {
    return "image";
  }

  if (
    mimetype.startsWith("video/") ||
    [".mp4", ".mov", ".avi", ".webm"].includes(ext)
  ) {
    return "video";
  }

  return null;
};
