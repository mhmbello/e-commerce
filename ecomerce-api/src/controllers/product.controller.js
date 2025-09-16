import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";
import createError from "http-errors";
import { successResponse } from "./response.controller.js";
import mongoose from "mongoose";
//add product
const handleAddProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      minStock,
      expiryDate
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (img) => img !== undefined
    );

    const forever = `product/${category}`;

    let imagesURL = await Promise.all(
      images.map(async (img) => {
        let result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: forever,
        });

        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imagesURL,
      date: Date.now(),
      stock,
      minStock,
      expiryDate
    };

    console.log("PRODUCT :::::::::::::::::::::::::::", productData)

    const product = await productModel.create(productData);

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product was added successfully",
    });
  } catch (error) {
    next(error);
  }
};

//get all product
const handleAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.find()
    .populate("category", "name")     // récupère uniquement le champ name
    .populate("subCategory", "name");

    if (!products || products.length === 0) {
      throw createError(404, "No products found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "All product was returend successfully",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      minStock,
      expiryDate,
    } = req.body;

    // Charger les images uploadées
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((img) => img);

    // Trouver le produit existant
    const product = await productModel.findById(id);
    if (!product) {
      throw createError(404, "Product not found");
    }

    let imagesURL = [];

    if (images.length > 0) {
      // 🔥 Supprimer les anciennes images de Cloudinary
      if (product.image && product.image.length > 0) {
        for (const imgUrl of product.image) {
          // Récupérer le public_id de Cloudinary depuis l’URL
          const publicId = imgUrl.split("/").slice(-2).join("/").split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Uploader les nouvelles images
      const forever = `product/${category}`;
      imagesURL = await Promise.all(
        images.map(async (img) => {
          let result = await cloudinary.uploader.upload(img.path, {
            resource_type: "image",
            folder: forever,
          });
          return result.secure_url;
        })
      );

      // Remplacer totalement
      product.image = imagesURL;
    }

    // Mise à jour des champs
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category ?? product.category;
    product.subCategory = subCategory ?? product.subCategory;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.bestseller =
      bestseller !== undefined
        ? bestseller === "true"
          ? true
          : false
        : product.bestseller;
    product.stock = stock ?? product.stock;
    product.minStock = minStock ?? product.minStock;
    product.expiryDate = expiryDate ?? product.expiryDate;

    await product.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Product updated successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

//remove product
const handleRemoveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid mongoose id");
    }

    const product = await productModel.findOneAndDelete(id);

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
//get single product
const handleSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid mongoose id");
    }

    const product = await productModel.findById(id);

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was returned successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id).lean();
     console.log("📌 Produit trouvé :", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé",
      });
    }

    console.log("✅ Produit trouvé :", product);

    res.status(200).json({
      success: true,
      message: "Produit retourné avec succès",
      payload: product,
    });
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message,
    });
  }
};



export {
  handleAddProduct,
  handleAllProducts,
  handleRemoveProduct,
  handleSingleProduct,
  handleUpdateProduct,
  getProductById,
};
