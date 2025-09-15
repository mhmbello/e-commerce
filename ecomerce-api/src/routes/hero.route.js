import express from "express";
import Hero from "../models/hero.model.js";
import upload from "../middlewares/multer.js";
import { v2 as cloudinary } from "cloudinary";

const heroRouter = express.Router();
heroRouter.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne().sort({ updatedAt: -1 });
    res.json({ success: true, payload: hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// POST / UPDATE Hero
heroRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const { slogan, title, ctaText } = req.body;

    let imageUrl = req.body.image; // cas où tu envoies déjà un URL
    if (req.file) {
      // si un fichier est uploadé, le mettre sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "forever/hero",
      });
      imageUrl = result.secure_url;
    }

    const hero = await Hero.findOneAndUpdate(
      {},
      { slogan, title, ctaText, image: imageUrl, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.json({ success: true, payload: hero });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default heroRouter;
