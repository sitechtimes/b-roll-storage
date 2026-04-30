import { Request, Response } from "express";
import { Media } from "../models/media";
import { processImage, processVideo } from "../utils/ai_processing";

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
  try {
    const createdMedia = [];

    for (let i = 0; i < req.body.length; i++) {
      const mediaPath = req.body[i].path;
      let aiTags: string[] = [];

      if (req.body[i].type == "image") {
        aiTags = await processImage(mediaPath);
      } else if (req.body[i].type == "video") {
        aiTags = await processVideo(mediaPath);
      }

      const combinedTags = [
        ...new Set(
          [...req.body[i].tags, ...aiTags]
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        ),
      ];

      req.body[i].tags = combinedTags;

      const newMedia = await Media.create(req.body[i]);
      createdMedia.push(newMedia);
    }

    return res.status(200).json(createdMedia);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err instanceof Error ? err.message : err });
  }
}

async function deleteMedia(req: Request, res: Response) {
  const media = await Media.findByIdAndDelete(req.params.id);
  if (!media) return res.status(404).json({ error: "Media not found" });

  return res.status(200).json({ message: "Media successfully deleted" });
}

async function deleteAllMedia(req: Request, res: Response) {
  const media = await Media.deleteMany({});
  if (!media) return res.status(404).json({ error: "Media not found" });

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
