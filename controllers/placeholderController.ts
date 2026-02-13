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

module.exports = {getHelloWorld, getArticleByTitle, login}