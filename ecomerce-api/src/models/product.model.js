import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },

  description: { type: String, required: true },

  price: { type: Number, required: true },

  image: { type: [String], required: true },

  category: { type: String, required: true },

  subCategory: { type: String, required: true },

  sizes: { type: [String], required: true },

  bestseller: { type: Boolean, required: true },

  stock: { type: Number, required: true, default: 0 },

  minStock: { type: Number, required: true, default: 5 },

  expiryDate: { type: Date, required: false }, // Date cohérente

  isExpired: { type: Boolean, default: false },

  date: { type: Number, required: true },
});

// ✅ Middleware pour calculer si expiré
productSchema.pre("save", function (next) {
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.isExpired = true;
  } else {
    this.isExpired = false;
  }
  next();
});

const productModel = model("product", productSchema);

export default productModel;
