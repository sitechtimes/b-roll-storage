import { Request, Response } from "express";

async function getHelloWorld(req: Request, res: Response) {
    res.json("Hello World");
};

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


async function testAI(req: Request, res: Response) {
    try {
        const { image } = req.body || {};
        const { processVideo } = require('../utils/ai_processing');

        const tags = await processVideo(image);
        res.json({ ok: true, tags });
    } catch (err) {
        res.status(500).json({ ok: false, error: String(err) });
    }
}

module.exports = {getHelloWorld, getArticleByTitle, login, testAI}