import { Response, Request } from "express";
import { User } from "../models/user";
import { UserRole } from "../utils/userRole";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";

const emailCooldown = 60; // email verification cooldown in seconds

function generateCode() {
  return Math.floor(Math.random()*1000000).toString();
}

async function sendVerificationEmail(user: InstanceType<typeof User>) {
  const code = generateCode();
  user.verificationCode = code;
  await user.save();

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "B-roll Storage — Verify your email",
    html: `
      Hello there,
      <br>
      Your verification code is: <strong>${code}</strong>
    `,
  });
}

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

    try {
      await sendVerificationEmail(newUser);
    } catch (err) {
      console.error("EMAIL FAILED", err);
      return res.status(500).json({
        error: "Account created, but the verification email could not be sent",
      });
    }

    return res.status(201).json({
      message: "Account created. Verification email sent.",
    });
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

async function verify(req: Request, res: Response) {
  const { token } = req.query;
  if (typeof token !== "string")
    return res.status(401).json({ error: "EVIL_TOKEN" });

  const user = await User.findOne({ verificationCode: token });

  if (!user) return res.status(401).json({ error: "INVALID_TOKEN" });

  if (!process.env.JWT_KEY)
    return res.status(500).json({ error: "KRILL_ISSUE" });

  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch {
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }

  user.verificationCode = undefined;
  user.verified = true;
  await user.save();

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const userJWT = jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "6h" });

  res.status(200).send({ ...user.toJSON(), token: userJWT });
}

async function sendVerify(req: Request, res: Response) {
  if (!req.currentUser) {
    return res.status(401).json({
      error: "INVALID_CREDENTIALS",
    });
  }

  const { email } = req.currentUser;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(401).json({
      error: "INVALID_CREDENTIALS",
    });
  }

  if (existingUser.verified) {
    return res.status(200).json({
      verified: true,
    });
  }

  if (existingUser.verificationCode) {
    const decoded = jwt.decode(
      existingUser.verificationCode,
    ) as JwtPayload | null;

    const issuedAt = decoded?.iat ?? 0;

    const cooldownEnds = (issuedAt + emailCooldown) * 1000;

    if (!req.body?.newToken) {
      return res.status(200).json({
        message: "checking in",
        time: cooldownEnds,
      });
    }

    if (Date.now() / 1000 - issuedAt < emailCooldown) {
      return res.status(429).json({
        message: "email machine on cooldown",
        time: cooldownEnds,
      });
    }
  }

  try {
    await sendVerificationEmail(existingUser);
    return res.status(201).json({
      message: "verification sent",
      time: Date.now() + emailCooldown * 1000,
    });
  } catch (err) {
    console.error("EMAIL FAILED", err);

    return res.status(500).json({
      error: "failed to send email",
    });
  }
}

async function sendReset(req: Request, res: Response) {
  const email = req.body.email;

  const resetToken = jwt.sign({ email }, process.env.JWT_KEY!, {
    expiresIn: "20m",
  });

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "B-roll Storage — Reset passwrod",
    // send it to the frontend page where they will input a new password, then use the token and password to run the function below
    html: `
      Hello there,
      click the following link to reset your password:
      <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
        Reset Password
      </a>
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);

    return res.status(201).json({
      message: "reset sent",
      time: Date.now() + emailCooldown * 1000,
    });
  } catch (err) {
    console.error("EMAIL FAILED");
    console.error(err);

    return res.status(500).json({
      error: "failed to send email",
    });
  }
}

async function resetPassword(req: Request, res: Response) {
  const token = req.query.token;
  const newPassword = req.body.password;

  if (typeof token !== "string") {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(401).json({ error: "INVALID_TOKEN" });

    try {
      user.password = newPassword;
      await user.save();
    } catch (err) {
      return res.status(500).json({ error: "Save failed" });
    }

    return res.json({ message: "New password saved" });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
  verify,
  sendVerify,
  sendReset,
  resetPassword,
};
