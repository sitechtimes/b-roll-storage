"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mediaType_1 = require("../utils/mediaType");
const schemaDefinition = {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: Object.values(mediaType_1.MediaType),
        required: true,
        immutable: true,
    },
    path: {
        type: String,
        required: true,
        immutable: true,
    },
    tags: {
        type: [String],
        default: [],
        required: true,
    },
};
const mediaSchema = new mongoose_1.default.Schema(schemaDefinition, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.slug_history;
        },
    },
});
const Media = mongoose_1.default.model("Media", mediaSchema);
exports.Media = Media;
