"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const media_1 = require("../models/media");
const ai_processing_1 = require("../utils/ai_processing");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getFileType_1 = require("../utils/getFileType");
async function index(req, res) {
    const media = await media_1.Media.find();
    return res.json(media);
}
async function getMediaById(req, res) {
    const media = await media_1.Media.findById(req.params.id);
    if (!media)
        return res.status(404).json({ error: "Media Not Found" });
    return res.status(200).json(media);
}
async function getMedia(req, res) {
    let query = {};
    if (req.query.type && ["image", "video"].includes(req.query.type)) {
        query.type = req.query.type;
    }
    if (req.query.title) {
        query.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.tags) {
        if (req.query.strict == "true") {
            query.tags = { $all: req.query.tags.split(",") };
        }
        else {
            query.tags = { $in: req.query.tags.split(",") };
        }
    }
    const media = await media_1.Media.find(query);
    if (media.length === 0) {
        return res.status(404).json({ error: "Media Not Found" });
    }
    return res.status(200).json(media);
}
async function createMedia(req, res) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }
        let metadata = [];
        const successes = [];
        const failures = [];
        try {
            metadata = req.body.metadata ? JSON.parse(req.body.metadata) : [];
        }
        catch {
            return res.status(400).json({ error: "Invalid metadata JSON" });
        }
        if (metadata.length && metadata.length !== files.length) {
            return res.status(400).json({
                error: "Metadata length must match number of files",
            });
        }
        await Promise.all(files.map(async (file, index) => {
            const fullPath = path_1.default.resolve(file.path).replace(/\\/g, "/");
            try {
                const type = (0, getFileType_1.getFileType)(file.mimetype, file.originalname);
                if (!type) {
                    throw new Error("Unsupported file type");
                }
                let aiTags = [];
                if (type === "image") {
                    aiTags = await (0, ai_processing_1.processImage)(fullPath);
                }
                else {
                    aiTags = await (0, ai_processing_1.processVideo)(fullPath);
                }
                const fileMeta = metadata[index] || {};
                const userTags = (fileMeta.tags || [])
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0);
                const tags = [...new Set([...userTags, ...aiTags])];
                successes.push({
                    title: fileMeta.title || file.originalname,
                    type,
                    path: fullPath,
                    tags,
                });
            }
            catch (err) {
                await fs_1.default.promises.unlink(file.path).catch(() => { });
                failures.push({
                    file: file.originalname,
                    error: err.message || "Processing failed",
                });
            }
        }));
        let savedMedia = [];
        try {
            savedMedia = successes.length ? await media_1.Media.insertMany(successes) : [];
        }
        catch (dbErr) {
            await Promise.all(successes.map((item) => fs_1.default.promises.unlink(item.path).catch(() => { })));
            return res.status(500).json({ error: "Database insert failed" });
        }
        return res.status(207).json({
            success: savedMedia,
            failed: failures,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to process media" });
    }
}
async function deleteMedia(req, res) {
    const media = await media_1.Media.findByIdAndDelete(req.params.id);
    if (!media)
        return res.status(404).json({ error: "Media not found" });
    await fs_1.default.promises.unlink(media.path).catch(() => { });
    return res.status(200).json({ message: "Media successfully deleted" });
}
async function deleteAllMedia(req, res) {
    const media = await media_1.Media.find();
    await Promise.all(media.map((m) => fs_1.default.promises.unlink(m.path).catch(() => { })));
    await media_1.Media.deleteMany({});
    return res.status(200).json({ message: "All media successfully deleted" });
}
async function updateMedia(req, res) {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Empty body" });
    }
    let updates = {};
    if (req.body.title) {
        updates.title = req.body.title;
    }
    if (req.body.tags) {
        const tags = [
            ...new Set(req.body.tags
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)),
        ];
        if (req.query.operation === "add") {
            updates.$addToSet = { tags: { $each: tags } };
        }
        else if (req.query.operation === "subtract") {
            updates.$pull = { tags: { $in: tags } };
        }
        else {
            return res.status(404).json({ error: "Missing operation" });
        }
    }
    const media = await media_1.Media.findByIdAndUpdate(req.params.id, updates, {
        returnDocument: "after",
    });
    if (!media)
        return res.status(404).json({ error: "Media not found" });
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
