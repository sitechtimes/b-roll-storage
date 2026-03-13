import { Request, Response } from "express";
import { Media } from "../models/media";

async function index(req: Request, res: Response) {
    const media = await Media.find();
    res.json(media);
}

async function getMediaById(req: Request, res: Response) {
    const media = await Media.findById(req.params.id)
    if (!media) return res.status(404).json({ error: "Media Not Found" })
    res.status(200).send(media);
};

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
    for (let i = 0; i < req.body.length; i++ ) {
        try {
            const newMedia = new Media(req.body[i])
            await newMedia.save()
            res.json(newMedia)
        } catch (err) {
            res.status(500).json(err)
        }
    }
};

async function deleteMedia(req: Request, res: Response) {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    await media.deleteOne()
    res.status(204).json({ message: "Media successfully deleted" });
};

async function updateMedia(req: Request, res: Response) {
    if (!req.body) {res.status(404).json({error: "Body not found"})}
    let updates: any = {}

    if (req.body.title) {updates.title = req.body.title}
    if (req.body.tags) {
        const tags = (req.body.tags as string[])
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        if (req.params.operation === 'add') {
            updates.$addToSet = { tags: { $each: tags } }
        }
        else if (req.params.operation === 'subtract') {
            updates.$pull = { tags: { $in: tags } }
        }
        else {
            res.status(404).json({ error: "Missing operation"})
        }
    }
    
    const media = await Media.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after' });
    if (!media) return res.status(404).json({ error: "Media not found" });

    res.json(media)
};

module.exports = {index, getMediaById, getMedia, createMedia, deleteMedia, updateMedia}; 