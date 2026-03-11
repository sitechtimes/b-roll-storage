import { Request, Response } from "express";
import { Media, IMedia } from "../models/media";

async function index(req: Request, res: Response) {
    const media = await Media.find();
    res.json(media);
}

async function getMedia(req: Request, res: Response) {
    let query: any = {}

    if (req.query.type) {query.type = req.query.type};
    if (req.query.title) {query.title = {$regex: req.query.title, $options: "i" }};
    if (req.query.strict == "true") {query.tags = {$all: (req.query.tags as string).split(",")}} 
    else {query.tags = {$in: (req.query.tags as string).split(",")}};

    const media = await Media.find(query)

    if (!media) return res.status(404).json({ error: "Media Not Found" })

    res.status(200).send(media);
};
  
async function createMedia(req: Request, res: Response) {
    try {
        const newMedia = new Media(req.body)
        await newMedia.save()
        res.json(newMedia)
    } catch (err) {
        res.status(500).json(err)
    }
};

async function deleteMedia(req: Request, res: Response) {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media Not Found" });

    await media.deleteOne()
    res.status(204).json({ message: "Media successfully deleted" });
};

async function updateMedia(req: Request, res: Response) {
    if (!req.body.title && !req.body.tags) return
    
    const updates = {
        title: req.body.title,
        tags: req.body.tags
    }
   
    const media = await Media.findByIdAndUpdate(req.params.id, updates, {new: true,});
    if (!media) return res.status(404).json({ error: "Media Not Found" });

    res.json(media)
};

module.exports = {index, getMedia, createMedia, deleteMedia, updateMedia};