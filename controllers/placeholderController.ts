import { Request, Response } from "express";
import { processImage } from "../utils/ai_processing";

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
        if (!req.file) return res.status(400).send('No image uploaded.');

        // req.file.path is the location provided by your upload middleware
        const result = await processImage(req.file.path);
        
        res.json({
            success: true,
            tags: result // This will contain the "Image Tags" output from the script
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {getHelloWorld, getArticleByTitle, login, testAI}