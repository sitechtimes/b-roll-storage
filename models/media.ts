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
    required: true,
    trim: true 
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

const mediaSchema = new mongoose.Schema<IMedia>(schemaDefinition, {
  toJSON: {
    transform(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.slug_history;
    },
  },
});

const Media = mongoose.model<IMedia>("Media", mediaSchema);

export { Media };