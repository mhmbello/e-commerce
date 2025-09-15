import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: Array,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  subCategory: {
    type: String,
    required: true,
  },

  sizes: {
    type: Array,
    required: true,
  },

  bestseller: {
    type: Boolean,
    required: true,
  },

  // ✅ Stock disponible
  stock: {
    type: Number,
    required: true,
    default: 0,
  },

  // ✅ Seuil minimal (alerte si stock < seuil)
  minStock: {
    type: Number,
    required: true,
    default: 5,
  },

  // ✅ Date de péremption (pour produits alimentaires/pharma)
  expiryDate: {
    type: Date,
    required: false, // facultatif car tous les produits ne périment pas
  },

  // ✅ Statut automatique
  isExpired: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true
  },
  minStock: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: String,
    required: false
  }
});

// Middleware pour mettre à jour le statut de péremption automatiquement
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