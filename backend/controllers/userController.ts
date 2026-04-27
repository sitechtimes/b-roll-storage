import { Request, RequestParamHandler, Response } from "express";
import { User } from "../models/user";
import { UserRole } from "../utils/userRole";

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

  if (
    req.query.role &&
    Object.values(UserRole).includes(req.query.role as UserRole)
  ) {
    query.role = req.query.role;
  }
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" };
  }

  const user = await User.find(query);

  if (user.length === 0) {
    return res.status(404).json({ error: "User Not Found" });
  }

  return res.status(200).json(user);
}

async function deleteUser(req: Request, res: Response) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(200).json({ message: "User successfully deleted" });
}

async function deleteAllUsers(req: Request, res: Response) {
  const user = await User.deleteMany({});
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(200).json({ message: "All users successfully deleted" });
}

async function updateUser(req: Request, res: Response) {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Empty body" });
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
    if (Object.values(UserRole).includes(req.body.role as UserRole)) {
      if (req.currentUser?.role === "admin") {
        updates.role = req.body.role;
      } else {
        warnings.push("Admin access is required to change roles");
      }
    } else {
      warnings.push("Role does not exist");
    }
  }

  if (req.body.name) {
    updates.name = req.body.name;
  }

  if (req.body.inventory) {
    const inventory = [
      ...new Set(
        (req.body.inventory as string[])
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      ),
    ];

    updates = {
      ...updates,
      $pull: { inventory: { $in: inventory } },
      $push: {
        inventory: { $each: inventory, $position: 0, $slice: 20 },
      },
    };
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: "after",
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({ user, warnings });
}

async function changePassword(req: Request, res: Response) {
  if (!req.body.password) {
    return res.status(404).json({ error: "New password not found" });
  }

  if (req.body.password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }
  const newPassword = req.body.password.trim();

  const thisUser = await User.findById(req.params.id);
  if (!thisUser) return res.status(404).json({ error: "User not found" });

  if (
    req.currentUser?.id !== thisUser?.id &&
    req.currentUser?.role !== "admin"
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (req.currentUser?.role !== "admin") {
    if (!req.body.currentPassword) {
      return res.status(404).json({ error: "Old password not found" });
    }

    const oldPassword = req.body.currentPassword.trim();

    if (!(await thisUser.comparePassword(oldPassword))) {
      return res.status(403).json({ error: "Current password does not match" });
    }
  }

  if (await thisUser.comparePassword(newPassword)) {
    return res.status(409).json({ error: "Password cannot be the same" });
  }

  try {
    thisUser.password = newPassword;
    await thisUser.save();
  } catch (err) {
    return res.status(500).json({ error: "Save failed" });
  }

  return res.json(thisUser);
}

module.exports = {
  index,
  getUserById,
  getUser,
  deleteUser,
  deleteAllUsers,
  updateUser,
  changePassword,
};
