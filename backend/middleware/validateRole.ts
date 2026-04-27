import { Request, Response, NextFunction } from "express";
import { UserRole } from "../utils/userRole";
import { requireAuth } from "./validateAuth";

export const requireRole = (role: UserRole) => [
  ...requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return void res.sendStatus(401);

    if (req.currentUser.role === role) {
      next();
    } else {
      res.sendStatus(403).json("Admin required");
    }
  },
];
