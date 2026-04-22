import { Request, RequestParamHandler, Response } from "express";
import { User } from "../models/user";
import { UserRole } from "../utils/userRole";
import { currentUser } from "../middleware/currentUser";
import bcrypt from "bcrypt";

async function index(req: Request, res: Response) {
  const user = await User.find();
  return res.json(user);
}

async function getUserById(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json("User not found");
  return res.json(user);
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

  return res.status(200).json(user);
}

async function deleteUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.deleteOne();
  return res.status(204).json({ message: "User successfully deleted" });
}

async function updateUser(req: Request, res: Response) {
  if (!req.body) {
    return res.status(404).json({ error: "Body not found" });
  }
  let updates: any = {};
  let warnings: string[] = [];

  const thisUser = await User.findById(req.params.id);
  if (!thisUser) return res.status(404).json({ error: "User not found" });

  if (
    req.currentUser?.id !== thisUser?.id &&
    req.currentUser?.role !== "admin"
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (req.body.role) {
    if (req.currentUser?.role === "admin") {
      updates.role = req.body.role;
    } else {
      warnings.push("Admin access is required to change roles");
    }
  }

  if (req.body.name) {
    updates.name = req.body.name;
  }

  if (req.body.inventory) {
    const inventory = (req.body.inventory as string[])
      .map((inventory) => inventory.trim())
      .filter((inventory) => inventory.length > 0);

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { inventory: { $in: inventory } },
    });

    updates.$push = {
      inventory: { $each: inventory, $position: 0, $slice: 20 },
    };
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: "after",
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({ user, warnings });
}

async function updatePassword(req: Request, res: Response) {
  if (!req.body.password) {
    return res.status(404).json({ error: "New password not found" });
  }

  const thisUser = await User.findById(req.params.id);
  if (!thisUser) return res.status(404).json({ error: "User not found" });

  if (
    req.currentUser?.id !== thisUser?.id &&
    req.currentUser?.role !== "admin"
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const newPassword = req.body.password.trim();

  if (await bcrypt.compare(req.body.password, thisUser.password)) {
    return res
      .status(409)
      .json({ error: "Password cannot be the same as the previous one" });
  }

  // const newPassword = await bcrypt.hash(req.body.password.trim(), 10);
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: newPassword },
    {
      returnDocument: "after",
    },
  );
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(user);
}

module.exports = {
  index,
  getUserById,
  getUser,
  deleteUser,
  updateUser,
  updatePassword,
};
