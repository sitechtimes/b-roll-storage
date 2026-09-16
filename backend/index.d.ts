import { UserRole } from "./utils/userRole";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export {};
