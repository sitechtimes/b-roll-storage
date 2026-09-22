"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const userRole_1 = require("../utils/userRole");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailCooldown = 60; // email verification cooldown in seconds
async function sendVerificationEmail(user) {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not configured");
    }
    const verificationToken = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: "20m" });
    user.verificationCode = verificationToken;
    await user.save();
    const transport = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    await transport.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "B-roll Storage - Verify your email",
        html: `
      <p>Hello ${user.name},</p>
      <p>Click the following link to verify your email:</p>
      <a href="${backendUrl}/auth/verify?token=${encodeURIComponent(verificationToken)}">
        Verify Email
      </a>
    `,
    });
}
async function signUp(req, res) {
    const { name, email, password, role } = req.body;
    if (await user_1.User.findOne({ email })) {
        return res.status(409).json({ error: "Email is already in use" });
    }
    const assignedRole = Object.values(userRole_1.UserRole).includes(role)
        ? role
        : userRole_1.UserRole.User;
    try {
        const newUser = await user_1.User.create({
            name,
            email,
            password,
            role: assignedRole,
        });
        try {
            await sendVerificationEmail(newUser);
        }
        catch (error) {
            console.error("EMAIL FAILED", error);
            return res.status(500).json({
                error: "Account created, but confirmation email could not be sent",
            });
        }
        return res.status(201).json({
            message: "Account created. Confirmation email sent.",
        });
    }
    catch {
        return res.status(500).json({ error: "Sign up failed" });
    }
}
async function signIn(req, res) {
    const { email, password } = req.body;
    const currentUser = await user_1.User.findOne({ email });
    if (!currentUser) {
        return res.status(409).json({ error: "Email does not exist" });
    }
    if (!(await bcrypt_1.default.compare(password, currentUser.password))) {
        return res.status(409).json({ error: "Incorrect password" });
    }
    const payload = {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
    };
    const userJWT = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, { expiresIn: "6h" });
    return res.status(200).send({
        ...currentUser.toJSON(),
        token: userJWT,
    });
    // sends the frontend the user data and the token attached
}
async function signOut(req, res) {
    return res.status(200).json({ message: "Signed out successfully" });
    // this returns a success message, the actual removal of the token occurs in the frontend
}
async function verify(req, res) {
    const { token } = req.query;
    if (typeof token !== "string")
        return res.status(401).json({ error: "EVIL_TOKEN" });
    const user = await user_1.User.findOne({ verificationCode: token });
    if (!user)
        return res.status(401).json({ error: "INVALID_TOKEN" });
    if (!process.env.JWT_KEY)
        return res.status(500).json({ error: "KRILL_ISSUE" });
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
    }
    catch {
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
    const userJWT = jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, { expiresIn: "6h" });
    res.status(200).send({ ...user.toJSON(), token: userJWT });
}
async function sendVerify(req, res) {
    if (!req.currentUser) {
        return res.status(401).json({
            error: "INVALID_CREDENTIALS",
        });
    }
    const { email } = req.currentUser;
    const existingUser = await user_1.User.findOne({ email });
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
        const decoded = jsonwebtoken_1.default.decode(existingUser.verificationCode);
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
    }
    catch (err) {
        console.error("EMAIL FAILED");
        console.error(err);
        return res.status(500).json({
            error: "failed to send email",
        });
    }
}
async function sendReset(req, res) {
    const email = req.body.email;
    const resetToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_KEY, {
        expiresIn: "20m",
    });
    const transport = nodemailer_1.default.createTransport({
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
    }
    catch (err) {
        console.error("EMAIL FAILED");
        console.error(err);
        return res.status(500).json({
            error: "failed to send email",
        });
    }
}
async function resetPassword(req, res) {
    const token = req.query.token;
    const newPassword = req.body.password;
    if (typeof token !== "string") {
        return res.status(400).json({ message: "Token is required" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        const user = await user_1.User.findOne({ email: payload.email });
        if (!user)
            return res.status(401).json({ error: "INVALID_TOKEN" });
        try {
            user.password = newPassword;
            await user.save();
        }
        catch (err) {
            return res.status(500).json({ error: "Save failed" });
        }
        return res.json({ message: "New password saved" });
    }
    catch {
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
