import { Response, Request } from "express";
import { User } from "../models/user";
import { UserRole } from "../utils/userRole";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

async function signUp(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  if (await User.findOne({ email })) {
    return res.status(409).json({ error: "Email is already in use" });
  }

  const assignedRole = Object.values(UserRole).includes(role)
    ? role
    : UserRole.User;

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });
    return res.status(200).json(newUser);
  } catch {
    return res.status(500).json({ error: "Sign up failed" });
  }
}

async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    return res.status(409).json({ error: "Email does not exist" });
  }

  if (!(await bcrypt.compare(password, currentUser.password))) {
    return res.status(409).json({ error: "Incorrect password" });
  }

  const payload = {
    id: currentUser.id,
    email: currentUser.email,
    role: currentUser.role,
  };

  const userJWT = jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "6h" });

  return res.status(200).send({
    ...currentUser.toJSON(),
    token: userJWT,
  });
  // sends the frontend the user data and the token attached
}

async function signOut(req: Request, res: Response) {
  return res.status(200).json({ message: "Signed out successfully" });
  // this returns a success message, the actual removal of the token occurs in the frontend
}

module.exports = {
  signUp,
  signIn,
  signOut,
  //verify,
  //sendVerify
};
