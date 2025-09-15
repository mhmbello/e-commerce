import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  slogan: String,
  title: String,
  ctaText: String,
  image: String, // URL ou Cloudinary link
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Hero", heroSchema);
