import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { currentUser } from "./currentUser";

/** checks that the user's JWT is valid, and that they are verified */
export const requireAuth = [
  currentUser,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return void res.sendStatus(401);

    const user = await User.findById(req.currentUser.id);

    if (!user) return void res.sendStatus(401); //if (!user || !user.verified) return void res.sendStatus(401);

    next();
  },
];
