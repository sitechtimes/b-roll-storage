import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

router.get(`/`, (req: Request, res: Response) => {
    res.json(`Hello World`)
});

router.get(`/article/:title`, (req: Request, res: Response) => {
    try {
        res.json(req.params.title);
    } catch (error) {}
});

router.post(`/login`, (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        res.json({ username, password });
    } catch (error) {}
}); 

module.exports = router;
