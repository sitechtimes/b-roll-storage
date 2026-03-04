import { Request, Response } from "express";
import { Media, IMedia } from "../models/media";

async function index(req: Request, res: Response) {
    const media = await Media.find();
    res.json(media);
}

async function getMedia(req: Request, res: Response) {
    try {
        let query: any = {}

        if (req.query.type) {query.type = req.query.type};
        if (req.query.title) {query.title = { $regex: req.query.title, $options: "i" }};
        if (req.query.tag) {query.tag = req.query.tag};

        const media = await Media.find(query)

        throw new Error("Couldn't fetch media.")
    } catch (error) {

    }
};

async function createMedia(req: Request, res: Response) {

};

async function deleteMedia(req: Request, res: Response) {
// by title
};

async function updateMedia(req: Request, res: Response) {
// add tags
};

module.exports = {index, getMedia, createMedia, deleteMedia, updateMedia};