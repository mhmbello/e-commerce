//config/db

import mongoose from "mongoose";
import { atlasURI } from "../secret.js";

const connectDB = async (option = {}) => {
  try {
    await mongoose.connect(atlasURI, option);
    console.log("✅ Connection to DB successfully established");

    mongoose.connection.on("error", (error) => {
      console.error(`❌ DB connection error: ${error}`);
    });
  } catch (error) {
    console.error(`❌ Could not connect: ${error.message}`);
    process.exit(1); // optionnel, arrêter l'app si la connexion échoue
  }
};

export default connectDB;
