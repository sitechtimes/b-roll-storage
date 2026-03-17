import mongoose from "mongoose";
import { UserRole } from "../utils/userRole";

const schemaDefinition = {
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true, 
        trim: true 
    },
    role: { 
        type: String, 
        enum: Object.values(UserRole), 
        default: UserRole.User, 
        required: true 
    },
    inventory: {
        type: [String],
        default: [] as string[],
        required: true,
    },
} as const;

const userSchema = new mongoose.Schema(schemaDefinition, {
    toJSON: {
        transform(doc, ret: any, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.verificationCode;
        },
    },
});

const User = mongoose.model("User", userSchema);

export { User };