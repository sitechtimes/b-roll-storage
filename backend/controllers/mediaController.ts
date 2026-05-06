import { Request, Response } from "express";
import { Media } from "../models/media";
import { processImage, processVideo } from "../utils/ai_processing";
import { FileMeta } from "../utils/filemetaType";
import path from "path";
import fs, { copyFileSync } from "fs";
import { getFileType } from "../utils/getFileType";

async function index(req: Request, res: Response) {
  const media = await Media.find();
  return res.json(media);
}

async function getMediaById(req: Request, res: Response) {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ error: "Media Not Found" });
  return res.status(200).json(media);
}

async function getMedia(req: Request, res: Response) {
  let query: any = {};

  if (req.query.type && ["image", "video"].includes(req.query.type as string)) {
    query.type = req.query.type;
  }
  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: "i" };
  }
  if (req.query.tags) {
    if (req.query.strict == "true") {
      query.tags = { $all: (req.query.tags as string).split(",") };
    } else {
      query.tags = { $in: (req.query.tags as string).split(",") };
    }
  }

  const media = await Media.find(query);

  if (media.length === 0) {
    return res.status(404).json({ error: "Media Not Found" });
  }

  return res.status(200).json(media);
}

async function createMedia(req: Request, res: Response) {
  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    let metadata: FileMeta[] = [];

    const successes: any[] = [];
    const failures: any[] = [];

    try {
      metadata = req.body.metadata ? JSON.parse(req.body.metadata) : [];
    } catch {
      return res.status(400).json({ error: "Invalid metadata JSON" });
    }

    if (metadata.length && metadata.length !== files.length) {
      return res.status(400).json({
        error: "Metadata length must match number of files",
      });
    }

    await Promise.all(
      files.map(async (file, index) => {
        const fullPath = path.resolve(file.path).replace(/\\/g, "/");

        try {
          const type = getFileType(file.mimetype, file.originalname);

          if (!type) {
            throw new Error("Unsupported file type");
          }

          let aiTags: string[] = [];

          if (type === "image") {
            aiTags = await processImage(fullPath);
          } else {
            aiTags = await processVideo(fullPath);
          }

          const fileMeta = metadata[index] || {};

          const userTags: string[] = (fileMeta.tags || [])
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0);

          const tags = [...new Set([...userTags, ...aiTags])];

          successes.push({
            title: fileMeta.title || file.originalname,
            type,
            path: fullPath,
            tags,
          });
        } catch (err: any) {
          await fs.promises.unlink(file.path).catch(() => {});

          failures.push({
            file: file.originalname,
            error: err.message || "Processing failed",
          });
        }
      }),
    );

    let savedMedia = [];

    try {
      savedMedia = successes.length ? await Media.insertMany(successes) : [];
    } catch (dbErr) {
      await Promise.all(
        successes.map((item) => fs.promises.unlink(item.path).catch(() => {})),
      );

      return res.status(500).json({ error: "Database insert failed" });
    }

    return res.status(207).json({
      success: savedMedia,
      failed: failures,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process media" });
  }
}

async function deleteMedia(req: Request, res: Response) {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) return res.status(404).json({ error: "Media not found" });

  await fs.promises.unlink(media.path).catch(() => {});

  return res.status(200).json({ message: "Media successfully deleted" });
}

async function deleteAllMedia(req: Request, res: Response) {
  const media = await Media.find();

  await Promise.all(
    media.map((m) => fs.promises.unlink(m.path).catch(() => {})),
  );

  await Media.deleteMany({});

  return res.status(200).json({ message: "All media successfully deleted" });
}

async function updateMedia(req: Request, res: Response) {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Empty body" });
  }
  let updates: any = {};

  if (req.body.title) {
    updates.title = req.body.title;
  }
  if (req.body.tags) {
    const tags = [
      ...new Set(
        (req.body.tags as string[])
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      ),
    ];
    if (req.query.operation === "add") {
      updates.$addToSet = { tags: { $each: tags } };
    } else if (req.query.operation === "subtract") {
      updates.$pull = { tags: { $in: tags } };
    } else {
      return res.status(404).json({ error: "Missing operation" });
    }
  }

  const media = await Media.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: "after",
  });
  if (!media) return res.status(404).json({ error: "Media not found" });

  return res.json(media);
}

module.exports = {
  index,
  getMediaById,
  getMedia,
  createMedia,
  deleteMedia,
  deleteAllMedia,
  updateMedia,
};
