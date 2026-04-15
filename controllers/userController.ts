import { Request, Response } from "express";
import { User } from "../models/user";

async function index(req: Request, res: Response) {
  const user = await User.find();
  res.json(user);
}

async function userById(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json("User not found");
  res.json(user);
}

async function getUser(req: Request, res: Response) {
  let query: any = {};

  if (req.query.role) {
    query.role = req.query.role;
  }
  if (req.query.name) {
    query.title = { $regex: req.query.name, $options: "i" };
  }

  const user = await User.find(query);

  if (!user) return res.status(404).json({ error: "User Not Found" });

  res.status(200).json(user);
}
