"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userRole_1 = require("../utils/userRole");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schemaDefinition = {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(userRole_1.UserRole),
        default: userRole_1.UserRole.User,
        required: true,
    },
    recents: {
        type: [String],
        default: [],
        required: true,
    },
    verificationCode: { type: String, required: false },
    verified: { type: Boolean, default: false },
};
const userSchema = new mongoose_1.default.Schema(schemaDefinition, {
    toJSON: {
        transform(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.verificationCode;
        },
    },
});
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    try {
        this.password = await bcrypt_1.default.hash(this.get("password").trim(), 10);
    }
    catch (err) {
        console.error("Password hashing failed:", err);
        throw err;
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword.trim(), this.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
