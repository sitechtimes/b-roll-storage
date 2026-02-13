import mongoose from "mongoose";

const schemaDefinition = {
  title: { 
    type: String, 
    required: true 
    },
  tags: { 
    type: String, 
    required: true 
    }, 
} as const;

const videoSchema = new mongoose.Schema(schemaDefinition);

const Video = mongoose.model("Video", videoSchema);

export { Video };