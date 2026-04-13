import mongoose from "mongoose";
import { UserRole } from "../utils/userRole";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  inventory: string[];
}

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
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.User,
    required: true,
  },
  inventory: {
    type: [String],
    default: [] as string[],
    required: true,
  },
} as const;

const userSchema = new mongoose.Schema<IUser>(schemaDefinition, {
  toJSON: {
    transform(doc, ret: any, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.get("password").trim(), 10);
  } catch (err) {
    console.error("Password hashing failed:", err);
    throw err;
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export { User };
