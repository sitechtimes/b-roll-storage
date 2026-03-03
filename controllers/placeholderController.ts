import { Request, Response } from "express";
import { Media } from "../models/media";

async function index(req: Request, res: Response) {
    const media = await Media.find();
    res.json(media);
}

async function getArticleByTitle(req: Request, res: Response) {
    try {
        res.json(req.params.title);
    } catch (error) {}
};

async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        res.json({ username, password });
    } catch (error) {}
};

module.exports = {index, getArticleByTitle, login}