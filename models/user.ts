import mongoose from "mongoose";
import { UserRole } from "./userRole";

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

const userSchema = new mongoose.Schema(schemaDefinition);

const User = mongoose.model("User", userSchema);

export { User };