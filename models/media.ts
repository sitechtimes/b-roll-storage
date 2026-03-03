import mongoose from "mongoose";
import { MediaType } from "./mediaType"

export interface IMedia extends mongoose.Document {
  title: string;
  type: MediaType;
  url: string;
  tags: string[]; 
}

const schemaDefinition = {
  title: { 
    type: String, 
    required: true 
    },
  type: {
    type: String,
    enum: Object.values(MediaType),
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: { 
    type: [String], 
    default: [] as string[],
    required: true,
    }, 
} as const;

const mediaSchema = new mongoose.Schema<IMedia>(schemaDefinition);

const Media = mongoose.model<IMedia>("Media", mediaSchema);

export { Media };