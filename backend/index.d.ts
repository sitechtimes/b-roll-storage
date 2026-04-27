import { UserRole } from "./utils/userRole";

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
