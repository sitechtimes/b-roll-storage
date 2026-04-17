import { Request, Response } from "express";
import { User } from "../models/user";

async function index(req: Request, res: Response) {
  const user = await User.find();
  res.json(user);
}

async function getUserById(req: Request, res: Response) {
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
    query.name = { $regex: req.query.name, $options: "i" };
  }

  const user = await User.find(query);

  if (!user) return res.status(404).json({ error: "User Not Found" });

  res.status(200).json(user);
}

async function deleteUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.deleteOne();
  res.status(204).json({ message: "User successfully deleted" });
}

async function updateUser(req: Request, res: Response) {
  if (!req.body) {
    res.status(404).json({ error: "Body not found" });
  }
  let updates: any = {};

  const user = await User.findById(req.params.id);
  if (!user) res.status(404).json({ error: "User not found" });

  if (req.body.name) {
    updates.name = req.body.name;
  }
  if (req.body.inventory) {
    const inventory = (req.body.inventory as string[])
      .map((inventory) => inventory.trim())
      .filter((inventory) => inventory.length > 0);
    while (user && user.inventory.length < 20) {
      //   updates.$addToSet = { tags: { $each: tags } };
      // } else if (req.params.operation === "subtract") {
      //   updates.$pull = { tags: { $in: tags } };
      // } else {
      //   res.status(404).json({ error: "Missing operation" });
    }
  }

  // const media = await Media.findByIdAndUpdate(req.params.id, updates, {
  //   returnDocument: "after",
  // });
  // if (!media) return res.status(404).json({ error: "Media not found" });

  // res.json(media);
}

module.exports = {
  index,
  getUserById,
  getUser,
  deleteUser,
};
